import { useEffect, useState } from "react";
import LoanCard from "../components/LoanCard";
import { motion } from "framer-motion";

const Home = () => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/loans?limit=6")
      .then(res => res.json())
      .then(data => setLoans(data));
  }, []);

  return (
    <div>
      <section className="hero min-h-[80vh] bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="hero-content text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-5xl font-bold">Empower Dreams with LoanLink</h1>
            <p className="mt-4">Apply & manage microloans seamlessly</p>
            <a href="/loans" className="btn btn-primary mt-6">Explore Loans</a>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-16 grid md:grid-cols-3 gap-6">
        {loans.map(loan => (
          <LoanCard key={loan._id} loan={loan} />
        ))}
      </section>
    </div>
  );
};

export default Home;
