import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";

const AllLoansAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch all loans
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/admin/all-loans");
      setLoans(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch loans", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // 🏠 Toggle Show on Home
  const handleToggleHome = async (loanId, currentValue) => {
    try {
      await axiosSecure.patch(`/admin/loan/show-home/${loanId}`, {
        showOnHome: !currentValue,
      });
      fetchLoans();
    } catch (error) {
      Swal.fire("Error", "Failed to update Home visibility", "error");
    }
  };

  // ✏️ Update Loan
  const handleUpdate = async (loan) => {
    const { value: formData } = await Swal.fire({
      title: "Update Loan",
      html: `
        <input id="title" class="swal2-input" placeholder="Title" value="${loan.title}" />
        <input id="interest" class="swal2-input" placeholder="Interest" value="${loan.interest}" />
        <input id="category" class="swal2-input" placeholder="Category" value="${loan.category}" />
      `,
      showCancelButton: true,
      preConfirm: () => {
        return {
          title: document.getElementById("title").value,
          interest: Number(document.getElementById("interest").value),
          category: document.getElementById("category").value,
        };
      },
    });

    if (formData) {
      try {
        await axiosSecure.patch(`/admin/loan/update/${loan._id}`, formData);
        Swal.fire("Updated!", "Loan updated successfully", "success");
        fetchLoans();
      } catch {
        Swal.fire("Error", "Failed to update loan", "error");
      }
    }
  };

  // 🗑️ Delete Loan
  const handleDelete = async (loanId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This loan will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/admin/loan/${loanId}`);
        Swal.fire("Deleted!", "Loan has been deleted", "success");
        fetchLoans();
      } catch {
        Swal.fire("Error", "Failed to delete loan", "error");
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!loans.length)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        No loans found
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary">All Loans (Admin)</h2>
      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table className="table table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Interest</th>
              <th>Category</th>
              <th>Show on Home</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td>
                  <img
                    src={loan.image || "https://via.placeholder.com/100x60"}
                    alt={loan.title}
                    className="w-20 h-14 object-cover rounded"
                  />
                </td>
                <td className="font-semibold">{loan.title}</td>
                <td>{loan.interest}%</td>
                <td>{loan.category}</td>
                <td>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={loan.showOnHome || false}
                    onChange={() => handleToggleHome(loan._id, loan.showOnHome)}
                  />
                </td>
                <td className="text-center space-x-2">
                  <button
                    onClick={() => handleUpdate(loan)}
                    className="btn btn-xs btn-info"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(loan._id)}
                    className="btn btn-xs btn-error"
                  >
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
};

export default AllLoansAdmin;
