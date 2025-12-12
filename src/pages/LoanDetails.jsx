import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function LoanDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset } = useForm();

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

  const onSubmit = async (data) => {
    if (!user) return toast.error("Login first to apply");

    try {
      const payload = {
        loanId: id,
        loanTitle: loan?.title,
        userEmail: user.email,
        interestRate: loan?.interest || 0,
        firstName: data.firstName,
        lastName: data.lastName,
        contactNumber: data.contactNumber,
        nationalId: data.nationalId,
        incomeSource: data.incomeSource,
        monthlyIncome: data.monthlyIncome,
        loanAmount: data.loanAmount,
        reason: data.reason,
        address: data.address,
        extraNotes: data.extraNotes,
        status: "pending",
        applicationFeeStatus: "unpaid",
        createdAt: new Date(),
      };

      await axios.post("http://localhost:3000/loan-applications", payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Loan application submitted successfully!");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!loan) return <div className="min-h-screen flex items-center justify-center">Loan not found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-semibold mb-4">{loan.title}</h2>
      <p className="mb-2"><strong>Category:</strong> {loan.category}</p>
      <p className="mb-2"><strong>Interest Rate:</strong> {loan.interest}%</p>
      <p className="mb-2"><strong>Max Loan Amount:</strong> ${loan.maxLimit}</p>
      <p className="mb-4">{loan.description}</p>

      <h3 className="text-2xl font-semibold mb-3">Apply for this Loan</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            {...register("firstName", { required: true })}
            placeholder="First Name"
            className="input input-bordered w-full"
          />
          <input
            {...register("lastName", { required: true })}
            placeholder="Last Name"
            className="input input-bordered w-full"
          />
          <input
            {...register("contactNumber", { required: true })}
            placeholder="Contact Number"
            className="input input-bordered w-full"
          />
          <input
            {...register("nationalId", { required: true })}
            placeholder="National ID / Passport"
            className="input input-bordered w-full"
          />
          <input
            {...register("incomeSource", { required: true })}
            placeholder="Income Source"
            className="input input-bordered w-full"
          />
          <input
            type="number"
            {...register("monthlyIncome", { required: true })}
            placeholder="Monthly Income"
            className="input input-bordered w-full"
          />
          <input
            type="number"
            {...register("loanAmount", { required: true })}
            placeholder="Loan Amount"
            className="input input-bordered w-full"
          />
          <input
            {...register("reason", { required: true })}
            placeholder="Reason for Loan"
            className="input input-bordered w-full"
          />
          <input
            {...register("address", { required: true })}
            placeholder="Address"
            className="input input-bordered w-full"
          />
          <input
            {...register("extraNotes")}
            placeholder="Extra Notes"
            className="input input-bordered w-full"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-4">Apply Now</button>
      </form>
    </div>
  );
}
