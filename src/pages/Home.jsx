import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import LoanCard from "../components/LoanCard";

const Home = () => {
  const [loans, setLoans] = useState([]);
  const controls = useAnimation();

  const feedbacks = [
    {
      name: "Rahim Ahmed",
      role: "Small Business Owner",
      message:
        "LoanLink made the entire loan process smooth and stress-free. Truly a modern platform.",
    },
    {
      name: "Nusrat Jahan",
      role: "Entrepreneur",
      message:
        "The transparency and real-time updates gave me full confidence throughout the process.",
    },
    {
      name: "Tanvir Hasan",
      role: "Freelancer",
      message:
        "Beautiful UI, simple flow, and fast approval. LoanLink is a game changer.",
    },
    {
      name: "Ayesha Siddika",
      role: "Startup Founder",
      message:
        "From applying to tracking EMI — everything is well organized and easy to use.",
    },
    {
      name: "Imran Hossain",
      role: "Retail Owner",
      message:
        "Highly recommended for small businesses. Secure, fast, and reliable platform.",
    },
  ];

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await fetch("http://localhost:3000/loans?limit=6");
        if (!res.ok) throw new Error("Failed to fetch loans");
        const data = await res.json();
        setLoans(data);
      } catch (error) {
        console.error("Error fetching loans:", error.message);
      }
    };

    fetchLoans();

    // start carousel animation
    controls.start({
      x: ["0%", "-100%"],
      transition: {
        repeat: Infinity,
        duration: 30,
        ease: "linear",
      },
    });
  }, [controls]);

  return (
    <div className="overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="min-h-[85vh] flex items-center justify-center text-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-950 dark:via-purple-900 dark:to-pink-950 transition-colors duration-500">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Empower Your Financial Journey with{" "}
            <span className="text-primary">LoanLink</span>
          </h1>
          <p className="text-base md:text-lg opacity-90 mb-8">
            Apply, track and manage microloans seamlessly with a transparent and
            modern digital platform built for borrowers and organizations.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/loans" className="btn btn-primary px-8">
              Explore Loans
            </Link>
            <Link to="/register" className="btn btn-outline px-8">
              Get Started
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ================= AVAILABLE LOANS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Available Loan Programs
          </h2>
          <p className="opacity-80 max-w-2xl mx-auto">
            Choose from a variety of loan options tailored to your needs.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loans.map((loan) => (
            <LoanCard key={loan._id} loan={loan} />
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-base-200 dark:bg-base-300/10 py-20 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
            How LoanLink Works
          </h2>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <motion.div whileHover={{ y: -8 }} className="p-6 rounded-xl bg-base-100 shadow">
              <h3 className="text-xl font-semibold mb-3">1. Choose a Loan</h3>
              <p className="opacity-80">
                Browse available loans and select the one that suits your needs.
              </p>
            </motion.div>
            <motion.div whileHover={{ y: -8 }} className="p-6 rounded-xl bg-base-100 shadow">
              <h3 className="text-xl font-semibold mb-3">2. Apply Online</h3>
              <p className="opacity-80">
                Submit your application digitally with required information.
              </p>
            </motion.div>
            <motion.div whileHover={{ y: -8 }} className="p-6 rounded-xl bg-base-100 shadow">
              <h3 className="text-xl font-semibold mb-3">3. Track & Repay</h3>
              <p className="opacity-80">
                Track approval status, EMI plans and repayments in one place.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= CUSTOMER FEEDBACK (HOVER PAUSE) ================= */}
      <section className="py-20 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-950 dark:via-purple-900 dark:to-pink-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
            Trusted by Real People
          </h2>

          <div className="overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={controls}
              onHoverStart={() => controls.stop()}
              onHoverEnd={() =>
                controls.start({
                  x: ["0%", "-100%"],
                  transition: {
                    repeat: Infinity,
                    duration: 30,
                    ease: "linear",
                  },
                })
              }
            >
              {[...feedbacks, ...feedbacks].map((item, index) => (
                <div
                  key={index}
                  className="min-w-[320px] max-w-[320px] bg-white dark:bg-base-200 shadow-xl rounded-2xl p-6 border border-base-300"
                >
                  <p className="opacity-90 mb-5 text-sm leading-relaxed">
                    “{item.message}”
                  </p>
                  <h4 className="font-semibold text-lg">{item.name}</h4>
                  <p className="text-sm opacity-70">{item.role}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-20 text-center bg-gradient-to-r from-purple-300 via-indigo-300 to-pink-300 dark:from-purple-900 dark:via-indigo-900 dark:to-pink-900 transition-colors duration-500">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Get Started?
        </h2>
        <p className="mb-8 opacity-90">
          Create an account today and take control of your financial future.
        </p>
        <Link to="/register" className="btn btn-primary px-10">
          Apply for a Loan
        </Link>
      </section>
    </div>
  );
};

export default Home;
