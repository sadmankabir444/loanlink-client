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
      const res = await axiosSecure.get("/admin/users");
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
      title: "Change Role",
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
      await axiosSecure.patch(`/admin/users/role/${userId}`, { role: newRole });
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update role");
    }
  };

  // =====================
  // Suspend / Unsuspend
  // =====================
  const handleSuspend = async (user) => {
    if (user.suspended) {
      const confirm = await MySwal.fire({
        title: "Unsuspend user?",
        showCancelButton: true,
      });
      if (!confirm.isConfirmed) return;

      try {
        await axiosSecure.patch(`/admin/users/suspend/${user._id}`, {
          suspended: false,
          reason: "",
        });
        toast.success("User unsuspended");
        fetchUsers();
      } catch {
        toast.error("Failed to unsuspend user");
      }
      return;
    }

    const { value: reason } = await MySwal.fire({
      title: "Suspend user",
      input: "textarea",
      inputPlaceholder: "Reason...",
      showCancelButton: true,
    });
    if (!reason) return;

    try {
      await axiosSecure.patch(`/admin/users/suspend/${user._id}`, {
        suspended: true,
        reason,
      });
      toast.success("User suspended");
      fetchUsers();
    } catch {
      toast.error("Failed to suspend user");
    }
  };

  // =====================
  // Delete User
  // =====================
  const handleDelete = async (id) => {
    const confirm = await MySwal.fire({
      title: "Delete user?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
    });
    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      setUsers(users.filter((u) => u._id !== id));
    } catch {
      toast.error("Failed to delete user");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-500 mb-5">
        Manage Users
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700 bg-gray-900">
        <table className="w-full text-sm text-gray-300">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-center">Role</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t border-gray-800 hover:bg-gray-800/50"
              >
                <td className="px-5 py-3 text-gray-100">
                  {user.name}
                </td>
                <td className="px-5 py-3">{user.email}</td>

                <td className="px-5 py-3 text-center capitalize">
                  {user.role}
                </td>

                <td className="px-5 py-3 text-center">
                  {user.suspended ? (
                    <span className="text-red-400 text-xs">Suspended</span>
                  ) : (
                    <span className="text-green-400 text-xs">Active</span>
                  )}
                </td>

                <td className="px-5 py-3 text-right space-x-2">
                  <button
                    onClick={() =>
                      handleRoleUpdate(user._id, user.role)
                    }
                    className="px-3 py-1.5 text-xs rounded border border-gray-600 hover:bg-gray-700"
                  >
                    Update Role
                  </button>

                  <button
                    onClick={() => handleSuspend(user)}
                    className="px-3 py-1.5 text-xs rounded border border-gray-600 hover:bg-gray-700"
                  >
                    {user.suspended ? "Unsuspend" : "Suspend"}
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    className="px-3 py-1.5 text-xs rounded border border-gray-600 hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-300"
          >
            <h3 className="text-gray-100 font-medium">{user.name}</h3>
            <p className="text-sm">{user.email}</p>

            <div className="flex gap-3 mt-2 text-xs">
              <span className="capitalize">{user.role}</span>
              <span>
                {user.suspended ? "Suspended" : "Active"}
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() =>
                  handleRoleUpdate(user._id, user.role)
                }
                className="flex-1 py-1.5 text-xs border border-gray-600 rounded"
              >
                Role
              </button>
              <button
                onClick={() => handleSuspend(user)}
                className="flex-1 py-1.5 text-xs border border-gray-600 rounded"
              >
                {user.suspended ? "Unsuspend" : "Suspend"}
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="flex-1 py-1.5 text-xs border border-gray-600 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
