import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔄 Load Users
  const fetchUsers = async () => {
    setLoading(true);
    const res = await axiosSecure.get(`/admin/users?search=${search}`);
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  // 🔁 Update Role
  const handleRoleChange = async (id, role) => {
    await axiosSecure.patch(`/admin/users/role/${id}`, { role });
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "User role updated successfully",
      timer: 1500,
      showConfirmButton: false,
    });
    fetchUsers();
  };

  // ⛔ Suspend User
  const handleSuspend = async (id) => {
    const { value: data } = await Swal.fire({
      title: "Suspend User",
      html: `
        <input id="reason" class="swal2-input" placeholder="Suspend Reason">
        <textarea id="feedback" class="swal2-textarea" placeholder="Why are you suspending this user?"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          reason: document.getElementById("reason").value,
          feedback: document.getElementById("feedback").value,
        };
      },
    });

    if (data?.reason) {
      await axiosSecure.patch(`/admin/users/suspend/${id}`, data);
      Swal.fire("Suspended!", "User has been suspended", "success");
      fetchUsers();
    }
  };

  // ✅ Activate User
  const handleActivate = async (id) => {
    await axiosSecure.patch(`/admin/users/activate/${id}`);
    Swal.fire("Activated!", "User is active again", "success");
    fetchUsers();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-primary">Manage Users</h2>

        <input
          type="text"
          placeholder="Search by name or email"
          className="input input-bordered w-full md:w-72"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table className="table table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="font-medium">
                  {user.name || "N/A"}
                </td>
                <td>{user.email}</td>

                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value)
                    }
                    className="select select-sm select-bordered"
                  >
                    <option value="borrower">Borrower</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td>
                  <span
                    className={`badge ${
                      user.status === "suspended"
                        ? "badge-error"
                        : "badge-success"
                    }`}
                  >
                    {user.status || "active"}
                  </span>
                </td>

                <td className="text-center space-x-2">
                  {user.status === "suspended" ? (
                    <button
                      onClick={() => handleActivate(user._id)}
                      className="btn btn-xs btn-success"
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSuspend(user._id)}
                      className="btn btn-xs btn-error"
                    >
                      Suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center py-6 text-gray-500">
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
