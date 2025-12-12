import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";

export default function LoanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    nationalID: "",
    incomeSource: "",
    monthlyIncome: "",
    loanAmount: "",
    reason: "",
    address: "",
    extraNotes: "",
  });

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/loans/${id}`);
        setLoan(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch loan details");
      } finally {
        setLoading(false);
      }
    };
    fetchLoan();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return toast.error("You must be logged in to apply");
    }
    try {
      const application = {
        ...formData,
        userEmail: user.email,
        loanTitle: loan.title,
        interest: loan.interest,
        status: "pending",
        applicationFeeStatus: "unpaid",
        createdAt: new Date(),
      };
      await axios.post("http://localhost:3000/loan-applications", application);
      toast.success("Loan application submitted!");
      navigate("/dashboard/my-loans");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!loan) return <div className="min-h-screen flex items-center justify-center">Loan not found</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-semibold mb-4">{loan.title}</h2>
      <img src={loan.image || "https://via.placeholder.com/400x200"} alt={loan.title} className="mb-4 rounded" />
      <p className="mb-4">{loan.description}</p>
      <p className="mb-4"><strong>Category:</strong> {loan.category}</p>
      <p className="mb-4"><strong>Interest Rate:</strong> {loan.interest}%</p>
      <p className="mb-4"><strong>Max Loan Limit:</strong> ${loan.maxLimit}</p>
      <p className="mb-4"><strong>Available EMI Plans:</strong> {loan.emiPlans?.join(", ") || "N/A"}</p>

      {user && user.role === "borrower" && (
        <>
          <h3 className="text-2xl font-semibold mt-6 mb-4">Apply Now</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              name="nationalID"
              placeholder="National ID / Passport Number"
              value={formData.nationalID}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              name="incomeSource"
              placeholder="Income Source"
              value={formData.incomeSource}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="number"
              name="monthlyIncome"
              placeholder="Monthly Income"
              value={formData.monthlyIncome}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="number"
              name="loanAmount"
              placeholder="Loan Amount"
              value={formData.loanAmount}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              name="reason"
              placeholder="Reason for Loan"
              value={formData.reason}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <textarea
              name="extraNotes"
              placeholder="Extra Notes"
              value={formData.extraNotes}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
            <button type="submit" className="btn btn-primary w-full">
              Submit Application
            </button>
          </form>
        </>
      )}
    </div>
  );
}
