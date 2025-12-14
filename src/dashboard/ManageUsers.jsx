import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";

const MySwal = withReactContent(Swal);

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // JWT from login

  // ===============================
  // Fetch All Users
  // ===============================
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
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

  // ===============================
  // Update User Role
  // ===============================
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
      await axios.patch(
        `http://localhost:5000/users/role/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Role updated successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  // ===============================
  // Suspend / Unsuspend User
  // ===============================
  const handleSuspend = async (user) => {
    const { value: reason } = await MySwal.fire({
      title: user.suspended ? "Unsuspend User?" : "Suspend User?",
      input: user.suspended ? null : "textarea",
      inputPlaceholder: "Enter reason for suspension...",
      showCancelButton: true,
    });

    if (user.suspended) {
      // Unsuspend
      try {
        await axios.patch(
          `http://localhost:5000/users/suspend/${user._id}`,
          { suspended: false, reason: "" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("User unsuspended");
        fetchUsers();
      } catch (err) {
        console.error(err);
        toast.error("Failed to unsuspend user");
      }
      return;
    }

    if (!reason) return;

    // Suspend
    try {
      await axios.patch(
        `http://localhost:5000/users/suspend/${user._id}`,
        { suspended: true, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User suspended successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to suspend user");
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
