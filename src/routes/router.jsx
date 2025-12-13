import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import AllLoans from "../pages/AllLoans";
import Login from "../pages/Login";
import Register from "../pages/Register";
import LoanDetails from "../pages/LoanDetails";
import PrivateRoute from "../components/PrivateRoute";
import ApplyLoan from "../pages/ApplyLoan";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/loans", element: <AllLoans /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/loan/:id",
        element: (
          <PrivateRoute>
            <LoanDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/apply-loan/:id",
        element: (
          <PrivateRoute>
            <ApplyLoan />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
