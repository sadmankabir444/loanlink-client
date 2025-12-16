// src/dashboard/ManageLoans.jsx
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";

const ManageLoans = () => {
  const axiosSecure = useAxiosSecure();
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =====================
  // Fetch Loans
  // =====================
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/manager/my-loans");
      setLoans(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch loans", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // =====================
  // Delete Loan
  // =====================
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Loan?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/manager/delete-loan/${id}`);
        toast.success("Loan deleted successfully");
        setLoans(loans.filter((loan) => loan._id !== id));
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete loan", "error");
      }
    }
  };

  // =====================
  // Filter loans by search
  // =====================
  const filteredLoans = loans.filter(
    (loan) =>
      loan.title.toLowerCase().includes(search.toLowerCase()) ||
      loan.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary">Manage Loans</h2>
        <input
          type="text"
          placeholder="Search by title or category"
          className="input input-bordered mt-3 md:mt-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Interest</th>
              <th>Category</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  No loans found
                </td>
              </tr>
            )}

            {filteredLoans.map((loan) => (
              <tr key={loan._id}>
                <td>
                  <img
                    src={loan.image}
                    alt={loan.title}
                    className="w-20 h-14 rounded object-cover"
                  />
                </td>
                <td className="font-semibold">{loan.title}</td>
                <td>{loan.interest}%</td>
                <td>{loan.category}</td>
                <td className="text-center space-x-2">
                  <button
                    className="btn btn-xs btn-info"
                    onClick={() =>
                      Swal.fire(
                        "Update Feature",
                        "Use the update-loan page",
                        "info"
                      )
                    }
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleDelete(loan._id)}
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

export default ManageLoans;
