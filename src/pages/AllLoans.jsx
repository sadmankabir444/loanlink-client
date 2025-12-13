import { useEffect, useState } from "react";
import LoanCard from "../components/LoanCard";

const AllLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/loans")
      .then(res => res.json())
      .then(data => {
        setLoans(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading loans...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Available Loans</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {loans.map(loan => (
          <LoanCard key={loan._id} loan={loan} />
        ))}
      </div>
    </div>
  );
};

export default AllLoans;
