// src/App.jsx
import { Routes, Route } from "react-router-dom";

/* ================== LAYOUTS ================== */
import MainLayout from "./layouts/MainLayout";
import DashLayout from "./layouts/DashLayout";

/* ================== PUBLIC PAGES ================== */
import Home from "./pages/Home";
import AllLoans from "./pages/AllLoans";
import LoanDetails from "./pages/LoanDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

/* ================== ROUTE GUARDS ================== */
import ProtectedRoute from "./components/ProtectedRoute";
import PrivateRoute from "./components/PrivateRoute";

/* ================== DASHBOARD PAGES ================== */
import MyLoans from "./dashboard/MyLoans";
import Profile from "./dashboard/Profile";
import PendingLoans from "./dashboard/PendingLoans";
import ApprovedLoans from "./dashboard/ApprovedLoans";
import ManageUsers from "./dashboard/ManageUsers";
import AllLoansAdmin from "./dashboard/AllLoansAdmin";

export default function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="all-loans" element={<AllLoans />} />

        {/* Single protected route */}
        <Route
          path="loan/:id"
          element={
            <ProtectedRoute>
              <LoanDetails />
            </ProtectedRoute>
          }
        />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* ================= DASHBOARD (ROLE BASED) ================= */}
      <Route
        element={
          <PrivateRoute allowedRoles={["borrower", "manager", "admin"]} />
        }
      >
        <Route path="/dashboard" element={<DashLayout />}>
          {/* Borrower */}
          <Route path="my-loans" element={<MyLoans />} />
          <Route path="profile" element={<Profile />} />

          {/* Manager / Admin */}
          <Route path="pending-loans" element={<PendingLoans />} />
          <Route path="approved-loans" element={<ApprovedLoans />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="all-loans" element={<AllLoansAdmin />} />
        </Route>
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
