import React from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-semibold mb-6">My Profile</h2>

      <div className="space-y-4">
        <div>
          <strong>Name:</strong> {user.name || "N/A"}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Role:</strong> {user.role || "Borrower"}
        </div>
        {user.photoURL && (
          <div>
            <img src={user.photoURL} alt="Profile" className="w-32 h-32 rounded-full object-cover mt-2" />
          </div>
        )}
      </div>

      <button onClick={handleLogout} className="btn btn-error mt-6">
        Logout
      </button>
    </div>
  );
}
