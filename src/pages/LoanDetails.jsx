// src/pages/LoanDetails.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";
import { AuthContext } from "../providers/AuthProvider";

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [loan, setLoan] = useState(null);
  const [role, setRole] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  // =====================
  // Fetch loan & user role
  // =====================
  useEffect(() => {
    
    if (!user?.email) return;

    setPageLoading(true);

    const fetchData = async () => {
      try {
        const [loanRes, userRes] = await Promise.all([
          axiosSecure.get(`/loans/${id}`),
          axiosSecure.get(`/users/${user.email}`),
        ]);

        setLoan(loanRes.data);
        setRole(userRes.data?.role || "");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch loan details", "error");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [id, user, axiosSecure]);

  // =====================
  // Loading state
  // =====================
  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // =====================
  // Loan not found
  // =====================
  if (!loan?._id) {
    return (
      <div className="text-center mt-24">
        <h2 className="text-2xl font-bold">Loan not found</h2>
        <p className="opacity-70 mt-2">
          The loan you are trying to view does not exist.
        </p>
      </div>
    );
  }

  const canApply = role === "borrower";

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-12"
      >
        {/* ================= IMAGE ================= */}
        <div>
          <img
            src={loan.image}
            alt={loan.title}
            className="w-full h-[420px] object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* ================= DETAILS ================= */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{loan.title}</h1>
            <p className="opacity-80">{loan.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-base-200 dark:bg-base-300/10 p-6 rounded-xl">
            <div>
              <p className="text-sm opacity-70">Category</p>
              <p className="font-semibold">{loan.category}</p>
            </div>

            <div>
              <p className="text-sm opacity-70">Interest Rate</p>
              <p className="font-semibold">{loan.interest}%</p>
            </div>

            <div>
              <p className="text-sm opacity-70">Maximum Amount</p>
              <p className="font-semibold">৳ {loan.maxAmount}</p>
            </div>

            <div>
              <p className="text-sm opacity-70">EMI Plans</p>
              <p className="font-semibold">{loan.emiPlans?.join(", ")} months</p>
            </div>
          </div>

          {/* ================= ACTION ================= */}
          <div className="pt-4">
            <button
              disabled={!canApply}
              onClick={() => navigate(`/apply-loan/${loan._id}`)}
              className={`btn w-full ${canApply ? "btn-primary" : "btn-disabled"}`}
            >
              Apply for this Loan
            </button>

            {!canApply && (
              <p className="text-sm text-red-500 mt-3">
                Only borrowers are allowed to apply for loans.
              </p>
            )}
          </div>

          {/* ================= INFO NOTE ================= */}
          <div className="bg-base-100 border border-base-300 p-4 rounded-lg text-sm opacity-80">
            ⚠ Please review loan terms carefully before applying. Once submitted, applications are reviewed by the loan manager.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoanDetails;
