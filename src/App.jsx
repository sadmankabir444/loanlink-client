// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import AllLoans from "./pages/AllLoans";
import LoanDetails from "./pages/LoanDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="all-loans" element={<AllLoans />} />
        <Route path="loan/:id" element={<ProtectedRoute><LoanDetails/></ProtectedRoute>} />
        <Route path="login" element={<Login/>} />
        <Route path="register" element={<Register/>} />
        <Route path="*" element={<NotFound/>} />
      </Route>
    </Routes>
  );
}
