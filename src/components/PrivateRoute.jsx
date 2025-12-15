import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import useUserRole from "../hooks/useUserRole";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // role only needed if allowedRoles provided
  const [role, roleLoading] = useUserRole(user?.email);

  // ======================
  // Loading State
  // ======================
  if (loading || (allowedRoles && roleLoading)) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // ======================
  // Not Logged In
  // ======================
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ======================
  // Role Based Protection
  // ======================
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // ======================
  // Authorized
  // ======================
  return <Outlet />;
};

export default PrivateRoute;
