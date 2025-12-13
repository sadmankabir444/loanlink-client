import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";

const MyLoans = () => {
  const { user } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/loan-applications?email=${user.email}`)
      .then(res => res.json())
      .then(data => setLoans(data))
      .catch(err => toast.error("Failed to fetch loans"))
      .finally(() => setLoading(false));
  }, [user.email]);

  if (loading) return (
    <div className="flex justify-center mt-20">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  if (loans.length === 0) return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-bold">No Loan Applications</h2>
      <p className="opacity-70">You haven't applied for any loans yet.</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-6">My Loan Applications</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Loan</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Fee</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(l => (
              <tr key={l._id}>
                <td>{l.loanTitle}</td>
                <td>৳{l.loanAmount}</td>
                <td className={`font-semibold ${l.status === "Pending" ? "text-yellow-500" : l.status === "Approved" ? "text-green-500" : "text-red-500"}`}>
                  {l.status}
                </td>
                <td>{l.feeStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyLoans;
