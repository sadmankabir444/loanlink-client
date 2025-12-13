import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PendingLoans = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  // Fetch pending applications
  const fetchApplications = () => {
    setLoading(true);
    fetch("http://localhost:3000/loan-applications?status=Pending")
      .then((res) => res.json())
      .then((data) => setApplications(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle status update (Approve / Reject)
  const handleUpdateStatus = (id, status) => {
    setProcessingId(id);
    fetch(`http://localhost:5000/loan-applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success(`Application ${status} ✅`);
        fetchApplications();
      })
      .catch(() => toast.error("Failed to update status ❌"))
      .finally(() => setProcessingId(null));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-6">Pending Loan Applications</h2>

      {applications.length === 0 && (
        <p className="text-center opacity-70">No pending applications</p>
      )}

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="card bg-base-200 dark:bg-base-300/10 p-4 rounded-lg shadow"
          >
            <h3 className="font-bold text-lg">{app.loanTitle}</h3>
            <p className="text-sm opacity-70">Applicant: {app.email}</p>
            <p className="text-sm opacity-70">Amount: ৳{app.loanAmount}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => handleUpdateStatus(app._id, "Approved")}
                disabled={processingId === app._id}
                className={`btn btn-success btn-sm ${
                  processingId === app._id ? "loading" : ""
                }`}
              >
                Approve
              </button>

              <button
                onClick={() => handleUpdateStatus(app._id, "Rejected")}
                disabled={processingId === app._id}
                className={`btn btn-error btn-sm ${
                  processingId === app._id ? "loading" : ""
                }`}
              >
                Reject
              </button>

              <button
                onClick={() => navigate(`/loan/${app.loanId}`)}
                className="btn btn-outline btn-sm"
              >
                View Details
              </button>
            </div>

            <p className="mt-2 text-sm opacity-70">
              Status: <span className="font-semibold">{app.status}</span> | Fee:{" "}
              <span className="font-semibold">{app.feeStatus}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingLoans;
