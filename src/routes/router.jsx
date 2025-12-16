import { createBrowserRouter } from "react-router-dom";

/* Layouts */
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

/* Pages */
import Home from "../pages/Home";
import AllLoans from "../pages/AllLoans";
import Login from "../pages/Login";
import Register from "../pages/Register";
import LoanDetails from "../pages/LoanDetails";
import ApplyLoan from "../pages/ApplyLoan";
import ErrorPage from "../pages/ErrorPage";

/* Dashboard Pages */
import MyLoans from "../dashboard/MyLoans";
import PendingLoans from "../dashboard/PendingLoans";
import ManageUsers from "../dashboard/ManageUsers";
import AdminLoans from "../dashboard/AdminLoans";
import Applications from "../dashboard/Applications";
import AddLoan from "../dashboard/AddLoan";
import ManageLoans from "../dashboard/ManageLoans";
import ApprovedLoans from "../dashboard/ApprovedLoans";
import Profile from "../dashboard/Profile";
import DashboardHome from "../dashboard/DashboardHome";


/* Guard */
import PrivateRoute from "../components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      // ---------- PUBLIC ----------
      { index: true, element: <Home /> },
      { path: "loans", element: <AllLoans /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // ---------- AUTH ----------
      {
        element: <PrivateRoute />,
        children: [
          { path: "loans/:id", element: <LoanDetails /> },
          { path: "apply-loan/:id", element: <ApplyLoan /> },
        ],
      },

      // ---------- DASHBOARD ----------
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          // 🔑 default dashboard page
           {
      index: true,
      element: <DashboardHome />,
    },

          // Borrower
          {
            path: "my-loans",
            element: (
              <PrivateRoute allowedRoles={["borrower"]}>
                <MyLoans />
              </PrivateRoute>
            ),
          },

          // Shared
          {
            path: "profile",
            element: (
              <PrivateRoute allowedRoles={["borrower", "manager", "admin"]}>
                <Profile />
              </PrivateRoute>
            ),
          },

          // Manager
          {
            path: "add-loan",
            element: (
              <PrivateRoute allowedRoles={["manager"]}>
                <AddLoan />
              </PrivateRoute>
            ),
          },
          {
            path: "manage-loans",
            element: (
              <PrivateRoute allowedRoles={["manager"]}>
                <ManageLoans />
              </PrivateRoute>
            ),
          },
          {
            path: "pending-loans",
            element: (
              <PrivateRoute allowedRoles={["manager"]}>
                <PendingLoans />
              </PrivateRoute>
            ),
          },
          {
            path: "approved-loans",
            element: (
              <PrivateRoute allowedRoles={["manager"]}>
                <ApprovedLoans />
              </PrivateRoute>
            ),
          },

          // Admin
          {
            path: "manage-users",
            element: (
              <PrivateRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </PrivateRoute>
            ),
          },
          {
            path: "all-loans",
            element: (
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminLoans />
              </PrivateRoute>
            ),
          },
          {
            path: "applications",
            element: (
              <PrivateRoute allowedRoles={["admin"]}>
                <Applications />
              </PrivateRoute>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
