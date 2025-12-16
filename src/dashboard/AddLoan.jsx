// src/dashboard/AddLoan.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";

const AddLoan = () => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    const loanData = {
      title: form.title.value,
      description: form.description.value,
      category: form.category.value,
      interest: Number(form.interest.value),
      maxAmount: Number(form.maxAmount.value),
      image: form.image.value,
      requiredDocs: form.requiredDocs.value,
      emiPlans: form.emiPlans.value.split(",").map((p) => Number(p.trim())),
      showOnHome: form.showOnHome.checked,
    };

    try {
      await axiosSecure.post("/manager/add-loan", loanData);
      Swal.fire("Success", "Loan added successfully", "success");
      form.reset();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to add loan", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-xl shadow">
      <h2 className="text-3xl font-bold text-primary mb-6">Add New Loan</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input type="text" name="title" placeholder="Loan Title" className="input input-bordered w-full" required />
        <input type="text" name="category" placeholder="Category (Business, Education, etc.)" className="input input-bordered w-full" required />
        <input type="number" name="interest" placeholder="Interest Rate (%)" className="input input-bordered w-full" required />
        <input type="number" name="maxAmount" placeholder="Max Loan Amount" className="input input-bordered w-full" required />
        <input type="text" name="emiPlans" placeholder="EMI Plans (e.g. 6,12,24)" className="input input-bordered w-full" required />
        <input type="text" name="image" placeholder="Image URL" className="input input-bordered w-full" required />
        <input type="text" name="requiredDocs" placeholder="Required Documents" className="input input-bordered w-full md:col-span-2" required />
        <textarea name="description" placeholder="Loan Description" className="textarea textarea-bordered w-full md:col-span-2" rows="4" required />

        <div className="flex items-center gap-2 md:col-span-2">
          <input type="checkbox" name="showOnHome" className="toggle toggle-primary" />
          <span>Show on Home Page</span>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary md:col-span-2">
          {loading ? "Adding..." : "Add Loan"}
        </button>
      </form>
    </div>
  );
};

export default AddLoan;
