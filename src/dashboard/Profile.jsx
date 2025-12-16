import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user: contextUser } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [user, setUser] = useState(contextUser || null);
  const [loading, setLoading] = useState(!contextUser);

  useEffect(() => {
    // Fetch fresh profile if context does not have all info
    const fetchProfile = async () => {
      if (!contextUser) return;
      try {
        setLoading(true);
        const res = await axiosSecure.get("/users/profile");
        setUser(res.data);
      } catch {
        Swal.fire("Error", "Failed to fetch profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [contextUser, axiosSecure]);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    });
  };

  if (loading || !user) return <LoadingSpinner />;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-primary mb-6">My Profile</h2>

      <div className="card bg-base-100 shadow-xl p-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={user.photoURL || "https://via.placeholder.com/150"}
          alt={user.name}
          className="w-32 h-32 rounded-full object-cover border-2 border-primary"
        />

        <div className="flex-1 space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.createdAt && (
            <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button className="btn btn-error" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
