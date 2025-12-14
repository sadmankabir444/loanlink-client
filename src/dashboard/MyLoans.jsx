import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";

const MyLoans = () => {
  const axiosSecure = useAxiosSecure();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/user/my-loans");
      setLoans(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch your loans", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Cancel Loan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
    });
    if (confirm.isConfirmed) {
      await axiosSecure.patch(`/user/cancel/${id}`);
      Swal.fire("Cancelled!", "Your loan has been cancelled", "success");
      fetchLoans();
    }
  };

  const handlePay = async (loan) => {
    // 🔹 Redirect to Stripe payment page
    // Example: for simplicity we simulate success
    const confirm = await Swal.fire({
      title: "Pay $10 application fee?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Pay Now",
    });

    if (confirm.isConfirmed) {
      // Simulate transaction ID
      const transactionId = "TXN" + new Date().getTime();
      await axiosSecure.patch(`/user/pay/${loan._id}`, { transactionId });
      Swal.fire("Paid!", "Application fee has been paid", "success");
      fetchLoans();
    }
  };

  const handleViewPayment = (loan) => {
    Swal.fire({
      title: "Payment Details",
      html: `
        <p><b>Loan ID:</b> ${loan._id}</p>
        <p><b>Email:</b> ${loan.userEmail}</p>
        <p><b>Transaction ID:</b> ${loan.paymentInfo?.transactionId}</p>
        <p><b>Paid At:</b> ${new Date(
          loan.paymentInfo?.paidAt
        ).toLocaleString()}</p>
      `,
      width: 500,
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-primary mb-6">My Loans</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Loan ID</th>
              <th>Loan Title</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Fee</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td>{loan._id.slice(0, 6)}...</td>
                <td>{loan.loanTitle}</td>
                <td>${loan.loanAmount}</td>
                <td>{loan.status}</td>
                <td>
                  {loan.applicationFeeStatus === "Paid" ? (
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() => handleViewPayment(loan)}
                    >
                      Paid
                    </button>
                  ) : (
                    <button
                      className="btn btn-xs btn-warning"
                      onClick={() => handlePay(loan)}
                    >
                      Pay
                    </button>
                  )}
                </td>
                <td className="text-center space-x-2">
                  <button
                    className="btn btn-xs btn-info"
                    onClick={() => Swal.fire(JSON.stringify(loan, null, 2))}
                  >
                    View
                  </button>
                  {loan.status === "Pending" && (
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleCancel(loan._id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {loans.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No loans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyLoans;
