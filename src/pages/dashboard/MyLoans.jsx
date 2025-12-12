import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { toast } from "react-toastify";

export default function MyLoans() {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyLoans = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/loan-applications?userEmail=${user.email}`);
      setLoans(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch your loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyLoans();
  }, [user]);

  const handleCancel = async (loanId) => {
    if (!window.confirm("Are you sure you want to cancel this pending loan?")) return;
    try {
      await axios.patch(`http://localhost:3000/loan-applications/${loanId}`, { status: "cancelled" });
      toast.success("Loan cancelled successfully!");
      fetchMyLoans();
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel loan");
    }
  };

  const handlePay = async (loanId) => {
    try {
      // Redirect to Stripe payment page (fixed $10)
      // Here, you can implement your Stripe logic
      // For demo, we'll just update status
      await axios.patch(`http://localhost:3000/loan-applications/${loanId}`, { applicationFeeStatus: "paid" });
      toast.success("Payment successful!");
      fetchMyLoans();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!loans.length) return <div className="min-h-screen flex items-center justify-center">You have no loans</div>;

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-3xl font-semibold mb-6">My Loans</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Loan Title</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Application Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td>{loan.loanTitle}</td>
                <td>${loan.loanAmount}</td>
                <td>{loan.status}</td>
                <td>{loan.applicationFeeStatus}</td>
                <td className="space-x-2">
                  <button className="btn btn-sm btn-info" onClick={() => alert(JSON.stringify(loan, null, 2))}>
                    View
                  </button>
                  {loan.status === "pending" && (
                    <button className="btn btn-sm btn-error" onClick={() => handleCancel(loan._id)}>
                      Cancel
                    </button>
                  )}
                  {loan.applicationFeeStatus === "unpaid" && (
                    <button className="btn btn-sm btn-primary" onClick={() => handlePay(loan._id)}>
                      Pay
                    </button>
                  )}
                  {loan.applicationFeeStatus === "paid" && (
                    <span className="badge badge-success cursor-pointer" onClick={() => alert("Payment details: $10")}>
                      Paid
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
