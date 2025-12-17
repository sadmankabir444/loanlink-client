import { useEffect, useState } from "react";
import LoanCard from "../components/LoanCard";

const AllLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await fetch("https://loanlink-server-seven.vercel.app/loans");
        if (!res.ok) {
          throw new Error("Failed to fetch loans");
        }
        const data = await res.json();
        setLoans(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load loans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg font-medium">
        Loading loans...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Available Loan Packages
      </h2>

      {loans.length === 0 ? (
        <p className="text-center text-gray-500">
          No loans available at the moment.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {loans.map((loan) => (
            <LoanCard key={loan._id} loan={loan} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllLoans;
