// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Public Layout & Pages
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import AllLoans from "./pages/AllLoans";
import LoanDetails from "./pages/LoanDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Protected Wrapper (for single routes)
import ProtectedRoute from "./components/ProtectedRoute";

// Dashboard Layout & Role-based Protected Routes
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Dashboard Pages
import MyLoans from "./pages/dashboard/MyLoans";
import Profile from "./pages/dashboard/Profile";
import PendingLoans from "./pages/dashboard/PendingLoans";
import ApprovedLoans from "./pages/dashboard/ApprovedLoans";
import ManageUsers from "./pages/dashboard/ManageUsers";
import AllLoansAdmin from "./pages/dashboard/AllLoansAdmin";

export default function App() {
  return (
    <Routes>
      {/* ---------- PUBLIC LAYOUT ---------- */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="all-loans" element={<AllLoans />} />

        {/* Protected single route inside public layout */}
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

      {/* ---------- PROTECTED DASHBOARD ROUTES ---------- */}
      <Route
        element={
          <PrivateRoute allowedRoles={["borrower", "manager", "admin"]} />
        }
      >
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Borrower routes */}
          <Route path="my-loans" element={<MyLoans />} />
          <Route path="profile" element={<Profile />} />

          {/* Manager/Admin routes */}
          <Route path="pending-loans" element={<PendingLoans />} />
          <Route path="approved-loans" element={<ApprovedLoans />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="all-loans" element={<AllLoansAdmin />} />
        </Route>
      </Route>

      {/* ---------- 404 NOT FOUND ---------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
