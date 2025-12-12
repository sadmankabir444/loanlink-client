import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Home() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get("http://localhost:3000/loans?limit=6");
        setLoans(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch loans");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-6 rounded-b-3xl">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Get Microloans Fast & Easy</h1>
          <p className="mb-6 text-lg md:text-xl">
            Apply, track, and manage your loans all in one platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/all-loans" className="btn btn-primary btn-lg">Explore Loans</Link>
            <Link to="/register" className="btn btn-outline btn-lg">Apply Now</Link>
          </div>
        </motion.div>
      </section>

      {/* Available Loans */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-6 text-center">Available Loans</h2>
        {loading ? (
          <div className="flex justify-center items-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loans.map((loan) => (
              <motion.div
                key={loan._id}
                className="card bg-white shadow rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={loan.image || "https://via.placeholder.com/400x200"}
                  alt={loan.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{loan.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{loan.description?.slice(0, 80)}...</p>
                  <p className="text-sm mb-2"><strong>Category:</strong> {loan.category}</p>
                  <p className="text-sm mb-4">
                    <strong>Max Limit:</strong> ${loan.maxLimit} | <strong>Interest:</strong> {loan.interest}%
                  </p>
                  <Link to={`/loan/${loan._id}`} className="btn btn-primary w-full">View Details</Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16 px-4">
        <h2 className="text-3xl font-semibold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">1. Apply Online</h3>
            <p>Fill out your loan application easily and securely online.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">2. Verification</h3>
            <p>Our team reviews your application quickly and efficiently.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">3. Get Approved</h3>
            <p>Once approved, funds are transferred directly to your account.</p>
          </div>
        </div>
      </section>

      {/* Customer Feedback Carousel (Simple) */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-semibold mb-8 text-center">Customer Feedback</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="p-6 bg-white shadow rounded-lg">
            <p className="text-gray-700 mb-2">"LoanLink made it so easy to get a small loan quickly!"</p>
            <p className="text-sm text-gray-500 font-semibold">— John Doe</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <p className="text-gray-700 mb-2">"I can track all my loans in one place now."</p>
            <p className="text-sm text-gray-500 font-semibold">— Jane Smith</p>
          </div>
        </div>
      </section>

      {/* Extra Section Example */}
      <section className="bg-blue-50 py-16 px-4">
        <h2 className="text-3xl font-semibold mb-4 text-center">Why Choose LoanLink?</h2>
        <p className="max-w-2xl mx-auto text-center text-gray-700">
          We provide fast microloans with minimal hassle, transparent interest rates, and a user-friendly dashboard to manage your loans.
        </p>
      </section>
    </div>
  );
}
