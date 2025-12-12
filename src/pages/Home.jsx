import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoanCard from "../components/LoanCard";

export default function Home() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/loans?limit=6")
      .then((res) => res.json())
      .then((data) => setLoans(data));
  }, []);

  return (
    <div className="space-y-20">

      {/* ---------------- Hero Section ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="hero min-h-[70vh] bg-base-200 rounded-xl"
      >
        <div className="hero-content flex-col lg:flex-row-reverse gap-12">
          <img
            src="https://i.ibb.co/WzCSPdn/loan-banner.jpg"
            className="rounded-lg shadow-2xl w-full max-w-lg"
          />

          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Fast & Easy Microloans <br /> For Everyone
            </h1>
            <p className="py-6 text-lg">
              Get quick access to microloans with flexible EMI plans and
              low-interest rates. Apply online and track your progress
              directly from your dashboard.
            </p>
            <a href="/all-loans" className="btn btn-primary">
              Explore Loans
            </a>
          </div>
        </div>
      </motion.div>

      {/* ---------------- Available Loans ---------------- */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Available Loans</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loans.map((loan) => (
            <LoanCard key={loan._id} loan={loan} />
          ))}
        </div>
      </section>
    </div>
  );
}
