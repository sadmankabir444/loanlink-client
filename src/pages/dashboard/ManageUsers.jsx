import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data);
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

  const handleRoleChange = async (userId, role) => {
    try {
      await axios.patch(`http://localhost:3000/users/${userId}`, { role });
      toast.success("User role updated!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  const handleSuspend = async (userId) => {
    const reason = prompt("Enter suspend reason:");
    if (!reason) return;
    try {
      await axios.patch(`http://localhost:3000/users/${userId}`, { suspended: true, suspendReason: reason });
      toast.success("User suspended!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to suspend user");
    }
  };

  const filteredUsers = users.filter(
    (user) => user.name?.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!users.length) return <div className="min-h-screen flex items-center justify-center">No users found</div>;

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-3xl font-semibold mb-6">Manage Users</h2>

      <input
        type="text"
        placeholder="Search by name or email"
        className="input input-bordered w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Suspended</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="select select-bordered select-sm"
                  >
                    <option value="borrower">Borrower</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{user.suspended ? "Yes" : "No"}</td>
                <td className="space-x-2">
                  {!user.suspended && (
                    <button className="btn btn-sm btn-error" onClick={() => handleSuspend(user._id)}>
                      Suspend
                    </button>
                  )}
                  <button className="btn btn-sm btn-info" onClick={() => alert(JSON.stringify(user, null, 2))}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
