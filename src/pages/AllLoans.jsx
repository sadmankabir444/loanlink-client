import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function AllLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchLoans();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!loans.length) {
    return <div className="min-h-screen flex items-center justify-center">No loans available</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-3xl font-semibold mb-6">All Loans</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loans.map((loan) => (
          <div key={loan._id} className="card bg-white shadow rounded-lg overflow-hidden">
            <img
              src={loan.image || "https://via.placeholder.com/400x200"}
              alt={loan.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{loan.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{loan.description?.slice(0, 80)}...</p>
              <p className="text-sm mb-2">
                <strong>Category:</strong> {loan.category}
              </p>
              <p className="text-sm mb-4">
                <strong>Max Limit:</strong> ${loan.maxLimit} | <strong>Interest:</strong> {loan.interest}%
              </p>
              <Link
                to={`/loan/${loan._id}`}
                className="btn btn-primary w-full"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
