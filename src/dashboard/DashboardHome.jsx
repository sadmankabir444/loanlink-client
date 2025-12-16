import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { FaHome, FaInfoCircle } from "react-icons/fa";

const DashboardHome = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl p-8 shadow-lg transform transition-transform hover:scale-105 duration-300">
        <h2 className="text-3xl font-extrabold">Welcome, {user?.displayName || "User"}!</h2>
        <p className="mt-2 opacity-80">
          Use the sidebar to navigate through your dashboard.
        </p>
      </div>

      {/* Info / Tips Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
          <FaInfoCircle /> Dashboard Overview
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          Here you can view your account info, check loan application statuses, and manage your interactions based on your role.
        </p>

        {user?.role === "manager" && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            As a manager, you can view pending and approved loan applications under the "Manage Loans" section.
          </p>
        )}

        {user?.role === "admin" && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            As an admin, you have full access to user management and all loan operations.
          </p>
        )}
      </div>

      {/* Quick Note */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <FaHome /> Quick Note
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          Always ensure your profile information is correct. Navigate using the sidebar to explore your options.
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;
