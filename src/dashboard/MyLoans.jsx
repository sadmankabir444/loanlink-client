// src/dashboard/MyLoans.jsx
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";
import { AuthContext } from "../providers/AuthProvider";

const MyLoans = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  
  // Fetch Loans
  
  const fetchLoans = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/loan-applications?email=${user.email}`);
      setLoans(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch your loans", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [user]);

  
  // Cancel Loan
  
  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Cancel Loan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
    });

    if (confirm.isConfirmed) {
      await axiosSecure.patch(`/loan-applications/${id}`, { status: "Cancelled" });
      Swal.fire("Cancelled!", "Your loan has been cancelled", "success");
      fetchLoans();
    }
  };

  
  // Pay Application Fee
  
  const handlePay = async (loan) => {
    const confirm = await Swal.fire({
      title: "Pay application fee?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Pay Now",
    });

    if (confirm.isConfirmed) {
      const transactionId = "TXN" + new Date().getTime();
      await axiosSecure.patch(`/loan-applications/${loan._id}`, { feeStatus: "Paid", transactionId });
      Swal.fire("Paid!", "Application fee has been paid", "success");
      fetchLoans();
    }
  };

  
  // View Payment Info
  
  const handleViewPayment = (loan) => {
    Swal.fire({
      title: "Payment Details",
      html: `
        <p><b>Loan ID:</b> ${loan._id}</p>
        <p><b>Email:</b> ${loan.email}</p>
        <p><b>Transaction ID:</b> ${loan.transactionId || "N/A"}</p>
        <p><b>Paid At:</b> ${loan.paidAt ? new Date(loan.paidAt).toLocaleString() : "N/A"}</p>
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
              <th>Title</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Fee</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loans.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No loans found
                </td>
              </tr>
            )}

            {loans.map((loan) => (
              <tr key={loan._id}>
                <td>{loan._id.slice(0, 6)}...</td>
                <td>{loan.loanTitle}</td>
                <td>৳{loan.loanAmount}</td>
                <td>{loan.status}</td>
                <td>
                  {loan.feeStatus === "Paid" ? (
                    <button className="btn btn-xs btn-success" onClick={() => handleViewPayment(loan)}>
                      Paid
                    </button>
                  ) : (
                    <button className="btn btn-xs btn-warning" onClick={() => handlePay(loan)}>
                      Pay
                    </button>
                  )}
                </td>
                <td className="text-center space-x-2">
                  <button className="btn btn-xs btn-info" onClick={() => Swal.fire(JSON.stringify(loan, null, 2))}>
                    View
                  </button>
                  {loan.status === "Pending" && (
                    <button className="btn btn-xs btn-error" onClick={() => handleCancel(loan._id)}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyLoans;
