import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const LoanDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loan, setLoan] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/loans/${id}`)
      .then(res => res.json())
      .then(data => setLoan(data));

    fetch(`http://localhost:5000/users/${user?.email}`)
      .then(res => res.json())
      .then(data => setRole(data?.role));
  }, [id, user]);

  if (!loan) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  const canApply = role === "borrower";

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <img
        src={loan.image}
        alt={loan.title}
        className="w-full h-80 object-cover rounded-lg"
      />

      <div className="mt-6 space-y-3">
        <h2 className="text-3xl font-bold">{loan.title}</h2>
        <p>{loan.description}</p>

        <p><strong>Category:</strong> {loan.category}</p>
        <p><strong>Interest Rate:</strong> {loan.interest}%</p>
        <p><strong>Max Limit:</strong> ৳{loan.maxAmount}</p>
        <p><strong>EMI Plans:</strong> {loan.emiPlans.join(", ")} months</p>

        <button
          disabled={!canApply}
          onClick={() => navigate(`/apply-loan/${loan._id}`)}
          className={`btn mt-6 ${canApply ? "btn-primary" : "btn-disabled"}`}
        >
          Apply Now
        </button>

        {!canApply && (
          <p className="text-red-500 text-sm">
            Only borrowers can apply for loans.
          </p>
        )}
      </div>
    </div>
  );
};

export default LoanDetails;
