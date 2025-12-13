import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";

const MyLoans = () => {
  const { user } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/loan-applications?email=${user.email}`)
      .then(res => res.json())
      .then(data => setLoans(data));
  }, [user.email]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Loan Applications</h2>

      <div className="overflow-x-auto">
        <table className="table">
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
                <td>{l.status}</td>
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
