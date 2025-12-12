import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function PendingLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingLoans = async () => {
    try {
      const res = await axios.get("http://localhost:3000/loan-applications?status=pending");
      setLoans(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch pending loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const handleApprove = async (loanId) => {
    try {
      await axios.patch(`http://localhost:3000/loan-applications/${loanId}`, {
        status: "approved",
        approvedAt: new Date(),
      });
      toast.success("Loan approved!");
      fetchPendingLoans();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve loan");
    }
  };

  const handleReject = async (loanId) => {
    try {
      await axios.patch(`http://localhost:3000/loan-applications/${loanId}`, {
        status: "rejected",
      });
      toast.success("Loan rejected!");
      fetchPendingLoans();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject loan");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!loans.length) return <div className="min-h-screen flex items-center justify-center">No pending loans</div>;

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-3xl font-semibold mb-6">Pending Loan Applications</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Loan Title</th>
              <th>User Info</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td>{loan.loanTitle}</td>
                <td>
                  {loan.firstName} {loan.lastName} <br />
                  {loan.userEmail}
                </td>
                <td>${loan.loanAmount}</td>
                <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                <td className="space-x-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => alert(JSON.stringify(loan, null, 2))}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleApprove(loan._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleReject(loan._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
