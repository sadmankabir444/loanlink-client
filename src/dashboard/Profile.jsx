import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaUserCircle, FaEnvelope, FaUserTag } from "react-icons/fa";


const Profile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchProfile = async () => {
      try {
        const res = await axiosSecure.get(`/users/${user.email}`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.email]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900 dark:via-purple-800 dark:to-pink-900 
                      text-gray-900 dark:text-white rounded-3xl p-10 shadow-xl flex flex-col items-center space-y-4 transition-colors duration-500">
        <FaUserCircle className="text-8xl md:text-9xl" />
        <h2 className="text-3xl md:text-4xl font-bold">{profile?.name || "N/A"}</h2>
        <p className="opacity-80 text-lg">{profile?.role}</p>
      </div>

      {/* Account Details */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 transition-colors duration-500">
        <h3 className="text-2xl font-semibold border-b border-gray-300 dark:border-gray-700 pb-3 mb-6
                       text-gray-900 dark:text-gray-200">
          Account Details
        </h3>

        <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-4">
          <div className="flex items-center gap-3 mb-3 md:mb-0">
            <FaEnvelope className="text-indigo-500 text-xl" />
            <span className="text-gray-900 dark:text-gray-200">{profile?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaUserTag className="text-purple-500 text-xl" />
            <span className="text-gray-900 dark:text-gray-200">{profile?.role}</span>
          </div>
        </div>

        {/* Optional extra info */}
        {profile?.phone && (
          <div className="flex items-center gap-3 mt-4">
            <FaUserTag className="text-green-500 text-xl" />
            <span className="text-gray-900 dark:text-gray-200">{profile.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
