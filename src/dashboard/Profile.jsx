import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/users/profile");
      setUser(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-primary mb-6">My Profile</h2>

      <div className="card bg-base-100 shadow-xl p-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={user?.photoURL || "https://via.placeholder.com/150"}
          alt={user?.name}
          className="w-32 h-32 rounded-full object-cover border-2 border-primary"
        />

        <div className="flex-1 space-y-2">
          <p>
            <span className="font-semibold">Name: </span> {user?.name}
          </p>
          <p>
            <span className="font-semibold">Email: </span> {user?.email}
          </p>
          <p>
            <span className="font-semibold">Role: </span> {user?.role}
          </p>
          <p>
            <span className="font-semibold">Joined: </span>{" "}
            {new Date(user?.createdAt).toLocaleDateString()}
          </p>
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
