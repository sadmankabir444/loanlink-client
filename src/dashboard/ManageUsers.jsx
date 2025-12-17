import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import useAxiosSecure from "../hooks/useAxiosSecure";

const MySwal = withReactContent(Swal);

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================
  // Fetch Users
  // =====================
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/admin/users"); // ✅ fixed
      setUsers(res.data.users || res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================
  // Update Role
  // =====================
  const handleRoleUpdate = async (userId, currentRole) => {
    const { value: newRole } = await MySwal.fire({
      title: "Select new role",
      input: "select",
      inputOptions: {
        admin: "Admin",
        manager: "Manager",
        borrower: "Borrower",
      },
      inputValue: currentRole,
      showCancelButton: true,
    });

    if (!newRole) return;

    try {
      await axiosSecure.patch(`/admin/users/role/${userId}`, { // ✅ fixed
        role: newRole,
      });
      toast.success("Role updated successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  // =====================
  // Suspend / Unsuspend
  // =====================
  const handleSuspend = async (user) => {
    if (user.suspended) {
      const confirm = await MySwal.fire({
        title: "Unsuspend User?",
        showCancelButton: true,
        confirmButtonText: "Yes, Unsuspend",
      });
      if (!confirm.isConfirmed) return;

      try {
        await axiosSecure.patch(`/admin/users/suspend/${user._id}`, {
          suspended: false,
          reason: "",
        });
        toast.success("User unsuspended");
        fetchUsers();
      } catch (err) {
        console.error(err);
        toast.error("Failed to unsuspend user");
      }
      return;
    }

    const { value: reason } = await MySwal.fire({
      title: "Suspend User?",
      input: "textarea",
      inputPlaceholder: "Enter reason for suspension...",
      showCancelButton: true,
    });
    if (!reason) return;

    try {
      await axiosSecure.patch(`/admin/users/suspend/${user._id}`, {
        suspended: true,
        reason,
      });
      toast.success("User suspended successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to suspend user");
    }
  };

  // =====================
  // Delete User
  // =====================
  const handleDelete = async (id) => {
    const confirm = await MySwal.fire({
      title: "Delete User?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/admin/users/${id}`); // ✅ fixed
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!users.length)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No users found
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-3xl font-semibold mb-6">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Suspended</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.suspended ? "Yes" : "No"}</td>
                <td className="space-x-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleRoleUpdate(user._id, user.role)}
                  >
                    Update Role
                  </button>
                  <button
                    className={`btn btn-sm ${
                      user.suspended ? "btn-success" : "btn-error"
                    }`}
                    onClick={() => handleSuspend(user)}
                  >
                    {user.suspended ? "Unsuspend" : "Suspend"}
                  </button>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleDelete(user._id)}
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

export default ManageUsers;
