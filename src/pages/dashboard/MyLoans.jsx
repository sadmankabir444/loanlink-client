import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("YOUR_STRIPE_PUBLISHABLE_KEY"); // Replace with your key

export default function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = { email: "borrower@example.com" }; // Replace with auth context

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/loan-applications?userEmail=${user.email}`);
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

  const handlePay = async (loan) => {
    if (loan.applicationFeeStatus === "paid") {
      alert(`Payment already done\nTransaction ID: ${loan.transactionId || "N/A"}`);
      return;
    }

    try {
      const stripe = await stripePromise;
      const res = await axios.post("http://localhost:3000/payment/create-checkout-session", {
        loanId: loan._id,
        userEmail: user.email,
        amount: 1000, // $10 in cents
      });
      await stripe.redirectToCheckout({ sessionId: res.data.id });
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Loans</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Loan Title</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan._id}>
              <td>{loan.loanTitle}</td>
              <td>${loan.loanAmount}</td>
              <td>{loan.applicationFeeStatus || "unpaid"}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handlePay(loan)}
                >
                  {loan.applicationFeeStatus === "paid" ? "Paid" : "Pay"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
