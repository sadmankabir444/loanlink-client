import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ApprovedLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedLoans = async () => {
    try {
      const res = await axios.get("http://localhost:3000/loan-applications?status=approved");
      setLoans(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch approved loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedLoans();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!loans.length) return <div className="min-h-screen flex items-center justify-center">No approved loans</div>;

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-3xl font-semibold mb-6">Approved Loan Applications</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Loan Title</th>
              <th>User Info</th>
              <th>Amount</th>
              <th>Approved Date</th>
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
                <td>{new Date(loan.approvedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => alert(JSON.stringify(loan, null, 2))}
                  >
                    View
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
