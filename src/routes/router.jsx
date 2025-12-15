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
import AdminRoute from "../components/AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      /* ---------- Public Routes ---------- */
      { index: true, element: <Home /> },
      { path: "loans", element: <AllLoans /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

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

      /* ---------- DASHBOARD ---------- */
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          /* Borrower */
          {
            index: true,
            element: <MyLoans />,
          },
          {
            path: "my-loans",
            element: <MyLoans />,
          },

          /* Manager */
          {
            path: "pending-loans",
            element: <PendingLoans />,
          },
          {
            path: "applications",
            element: <Applications />,
          },

          /* Admin Only */
          {
            path: "manage-users",
            element: (
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            ),
          },
          {
            path: "all-loans",
            element: (
              <AdminRoute>
                <AdminLoans />
              </AdminRoute>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
