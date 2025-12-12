import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function LoanDetails() {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    nationalId: "",
    incomeSource: "",
    monthlyIncome: "",
    loanAmount: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/loan-applications", formData);
      toast.success("Loan application submitted!");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application");
    }
  };

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} />}
      <form onSubmit={handleSubmit} className="p-4 max-w-xl mx-auto">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="input input-bordered w-full mb-2"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="input input-bordered w-full mb-2"
          required
        />
        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
          className="input input-bordered w-full mb-2"
          required
        />
        <input
          type="text"
          name="nationalId"
          placeholder="National ID"
          value={formData.nationalId}
          onChange={handleChange}
          className="input input-bordered w-full mb-2"
          required
        />
        <input
          type="text"
          name="incomeSource"
          placeholder="Income Source"
          value={formData.incomeSource}
          onChange={handleChange}
          className="input input-bordered w-full mb-2"
          required
        />
        <input
          type="number"
          name="monthlyIncome"
          placeholder="Monthly Income"
          value={formData.monthlyIncome}
          onChange={handleChange}
          className="input input-bordered w-full mb-2"
          required
        />
        <input
          type="number"
          name="loanAmount"
          placeholder="Loan Amount"
          value={formData.loanAmount}
          onChange={handleChange}
          className="input input-bordered w-full mb-2"
          required
        />
        <textarea
          name="reason"
          placeholder="Reason for Loan"
          value={formData.reason}
          onChange={handleChange}
          className="textarea textarea-bordered w-full mb-2"
          required
        ></textarea>
        <button type="submit" className="btn btn-primary w-full">Apply Now</button>
      </form>
    </>
  );
}
