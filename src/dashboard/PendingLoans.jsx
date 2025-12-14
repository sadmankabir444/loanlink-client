import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";

const PendingLoans = () => {
  const axiosSecure = useAxiosSecure();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/manager/pending");
      setApps(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "Approve Loan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
    });
    if (confirm.isConfirmed) {
      await axiosSecure.patch(`/manager/approve/${id}`);
      Swal.fire("Approved!", "Loan approved successfully", "success");
      fetchApps();
    }
  };

  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "Reject Loan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
    });
    if (confirm.isConfirmed) {
      await axiosSecure.patch(`/manager/reject/${id}`);
      Swal.fire("Rejected!", "Loan rejected successfully", "error");
      fetchApps();
    }
  };

  const handleView = (app) => {
    Swal.fire({
      title: "Loan Application Details",
      width: 650,
      html: `
        <div style="text-align:left">
          <p><b>User:</b> ${app.userName} (${app.userEmail})</p>
          <p><b>Loan Title:</b> ${app.loanTitle}</p>
          <p><b>Category:</b> ${app.loanCategory}</p>
          <p><b>Amount:</b> $${app.loanAmount}</p>
          <p><b>Status:</b> ${app.status}</p>
          <p><b>Applied Date:</b> ${new Date(
            app.createdAt
          ).toLocaleDateString()}</p>
          <p><b>Address:</b> ${app.address}</p>
          <p><b>Reason:</b> ${app.reason}</p>
        </div>
      `,
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-primary mb-6">
        Pending Loan Applications
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Loan ID</th>
              <th>User</th>
              <th>Loan Title</th>
              <th>Amount</th>
              <th>Date</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {apps.map((app) => (
              <tr key={app._id}>
                <td>{app._id.slice(0, 6)}...</td>
                <td>
                  <p className="font-semibold">{app.userName}</p>
                  <p className="text-sm opacity-70">{app.userEmail}</p>
                </td>
                <td>{app.loanTitle}</td>
                <td>${app.loanAmount}</td>
                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="text-center space-x-2">
                  <button
                    className="btn btn-xs btn-info"
                    onClick={() => handleView(app)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-xs btn-success"
                    onClick={() => handleApprove(app._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleReject(app._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}

            {apps.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No pending applications
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingLoans;
