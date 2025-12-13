import { useEffect, useState } from "react";

const PendingLoans = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/loan-applications?status=Pending")
      .then(res => res.json())
      .then(data => setApplications(data));
  }, []);

  const handleApprove = id => {
    fetch(`http://localhost:5000/loan-applications/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "Approved" }),
    })
      .then(res => res.json())
      .then(() => {
        setApplications(applications.filter(a => a._id !== id));
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pending Loan Applications</h2>

      {applications.map(app => (
        <div key={app._id} className="card bg-base-200 mb-4 p-4">
          <h3 className="font-bold">{app.loanTitle}</h3>
          <p>Applicant: {app.email}</p>
          <p>Amount: ৳{app.loanAmount}</p>

          <button
            onClick={() => handleApprove(app._id)}
            className="btn btn-success btn-sm mt-2"
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
};

export default PendingLoans;
