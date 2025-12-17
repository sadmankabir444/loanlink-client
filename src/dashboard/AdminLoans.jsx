import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AdminLoans = () => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetch("https://loanlink-server-seven.vercel.app/loans")
      .then((res) => res.json())
      .then((data) => setLoans(data));
  }, []);

  // Delete with confirmation modal
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This loan will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl shadow-xl",
        confirmButton: "btn btn-error px-6 py-2 ml-2",
        cancelButton: "btn btn-secondary px-6 py-2 mr-2",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://loanlink-server-seven.vercel.app/loans/${id}`, { method: "DELETE" })
          .then(() => {
            toast.success("Loan deleted successfully");
            setLoans(loans.filter((l) => l._id !== id));
          })
          .catch(() => {
            toast.error("Failed to delete loan");
          });
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Loans (Admin)</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {loans.map((loan) => (
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
