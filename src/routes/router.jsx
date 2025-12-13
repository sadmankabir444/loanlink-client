import { createBrowserRouter } from "react-router-dom";

/* Layouts */
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

/* Pages (Public) */
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

/* Route Guards */
import PrivateRoute from "../components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      /* ---------- Public Routes ---------- */
      {
        index: true,
        element: <Home />,
      },
      {
        path: "loans",
        element: <AllLoans />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },

      /* ---------- Protected Public Routes ---------- */
      {
        path: "loan/:id",
        element: (
          <PrivateRoute>
            <LoanDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "apply-loan/:id",
        element: (
          <PrivateRoute>
            <ApplyLoan />
          </PrivateRoute>
        ),
      },

      /* ---------- Dashboard Routes ---------- */
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          {
            path: "my-loans",
            element: <MyLoans />,
          },
          {
            path: "pending-loans",
            element: <PendingLoans />,
          },
          {
            path: "manage-users",
            element: <ManageUsers />,
          },
          {
            path: "all-loans",
            element: <AdminLoans />,
          },
          {
            path: "applications",
            element: <Applications />,
          },
        ],
      },
    ],
  },
]);

export default router;
