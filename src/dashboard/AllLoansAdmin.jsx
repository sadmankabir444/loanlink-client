import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AllLoansAdmin() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    try {
      const res = await axios.get("http://localhost:3000/loans");
      setLoans(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleDelete = async (loanId) => {
    if (!window.confirm("Are you sure you want to delete this loan?")) return;
    try {
      await axios.delete(`http://localhost:3000/loans/${loanId}`);
      toast.success("Loan deleted successfully!");
      fetchLoans();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete loan");
    }
  };

  const handleShowOnHome = async (loanId, currentValue) => {
    try {
      await axios.patch(`http://localhost:3000/loans/${loanId}`, { showOnHome: !currentValue });
      toast.success("Updated show on home!");
      fetchLoans();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update show on home");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!loans.length) return <div className="min-h-screen flex items-center justify-center">No loans found</div>;

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-3xl font-semibold mb-6">All Loans</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Interest</th>
              <th>Category</th>
              <th>Show on Home</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td>
                  <img
                    src={loan.image || "https://via.placeholder.com/100x60"}
                    alt={loan.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                </td>
                <td>{loan.title}</td>
                <td>{loan.interest}%</td>
                <td>{loan.category}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={loan.showOnHome || false}
                    onChange={() => handleShowOnHome(loan._id, loan.showOnHome)}
                    className="checkbox"
                  />
                </td>
                <td className="space-x-2">
                  <button className="btn btn-sm btn-info" onClick={() => alert(JSON.stringify(loan, null, 2))}>
                    Update
                  </button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDelete(loan._id)}>
                    Delete
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
