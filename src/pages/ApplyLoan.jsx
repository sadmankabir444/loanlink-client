import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import toast from "react-hot-toast";

const ApplyLoan = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loan, setLoan] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/loans/${id}`)
      .then(res => res.json())
      .then(data => setLoan(data));
  }, [id]);

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.target;

    const application = {
      loanId: id,
      loanTitle: loan.title,
      interest: loan.interest,
      email: user.email,
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      phone: form.phone.value,
      nid: form.nid.value,
      incomeSource: form.incomeSource.value,
      monthlyIncome: form.monthlyIncome.value,
      loanAmount: form.loanAmount.value,
      reason: form.reason.value,
      address: form.address.value,
      notes: form.notes.value,
      status: "Pending",
      feeStatus: "Unpaid",
      createdAt: new Date(),
    };

    fetch("http://localhost:5000/loan-applications", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(application),
    })
      .then(res => res.json())
      .then(() => {
        toast.success("Loan Application Submitted!");
        navigate("/dashboard/my-loans");
      });
  };

  if (!loan) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-6">Apply for {loan.title}</h2>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        <input readOnly value={user.email} className="input input-bordered" />
        <input readOnly value={loan.title} className="input input-bordered" />
        <input readOnly value={`${loan.interest}%`} className="input input-bordered" />

        <input name="firstName" placeholder="First Name" className="input input-bordered" required />
        <input name="lastName" placeholder="Last Name" className="input input-bordered" required />
        <input name="phone" placeholder="Contact Number" className="input input-bordered" required />
        <input name="nid" placeholder="NID / Passport" className="input input-bordered" required />
        <input name="incomeSource" placeholder="Income Source" className="input input-bordered" required />
        <input name="monthlyIncome" placeholder="Monthly Income" className="input input-bordered" required />
        <input name="loanAmount" placeholder="Loan Amount" className="input input-bordered" required />

        <textarea name="reason" placeholder="Reason for Loan" className="textarea textarea-bordered md:col-span-2" />
        <textarea name="address" placeholder="Address" className="textarea textarea-bordered md:col-span-2" />
        <textarea name="notes" placeholder="Extra Notes" className="textarea textarea-bordered md:col-span-2" />

        <button className="btn btn-primary md:col-span-2">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyLoan;
