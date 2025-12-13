import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminLoans = () => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/loans")
      .then(res => res.json())
      .then(data => setLoans(data));
  }, []);

  const handleDelete = id => {
    fetch(`http://localhost:5000/loans/${id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(() => {
        toast.success("Loan deleted");
        setLoans(loans.filter(l => l._id !== id));
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Loans (Admin)</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {loans.map(loan => (
          <div key={loan._id} className="border p-4 rounded">
            <h3 className="font-bold">{loan.title}</h3>
            <p>Interest: {loan.interest}%</p>
            <p>Max: ৳{loan.maxAmount}</p>

            <button
              onClick={() => handleDelete(loan._id)}
              className="btn btn-error btn-sm mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLoans;
