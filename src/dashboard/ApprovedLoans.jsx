import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";

const ApprovedLoans = () => {
  const axiosSecure = useAxiosSecure();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  
  // Fetch Approved Loans
  
  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/manager/approved");
      setApps(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch approved applications", "error");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchApps();
  }, []);

  
  // View Details
  
  const handleView = (app) => {
    Swal.fire({
      title: "Approved Loan Details",
      width: 650,
      html: `
        <div style="text-align:left">
          <p><b>User:</b> ${app.userName} (${app.userEmail})</p>
          <p><b>Loan Title:</b> ${app.loanTitle}</p>
          <p><b>Category:</b> ${app.loanCategory}</p>
          <p><b>Amount:</b> $${app.loanAmount}</p>
          <p><b>Status:</b> ${app.status}</p>
          <p><b>Approved Date:</b> ${new Date(
            app.approvedAt
          ).toLocaleDateString()}</p>
          <p><b>Address:</b> ${app.address}</p>
          <p><b>Reason:</b> ${app.reason}</p>
        </div>
      `,
    });
  };

  
  // Filtered Loans
  
  const filteredApps = apps.filter(
    (app) =>
      app.loanTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.loanCategory.toLowerCase().includes(search.toLowerCase()) ||
      app.userName.toLowerCase().includes(search.toLowerCase()) ||
      app.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary">
          Approved Loan Applications
        </h2>

        <input
          type="text"
          placeholder="Search by title, category, or user"
          className="input input-bordered mt-3 md:mt-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Loan ID</th>
              <th>User</th>
              <th>Loan Title</th>
              <th>Amount</th>
              <th>Approved Date</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredApps.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No approved applications found
                </td>
              </tr>
            )}

            {filteredApps.map((app) => (
              <tr key={app._id}>
                <td>{app._id.slice(0, 6)}...</td>
                <td>
                  <p className="font-semibold">{app.userName}</p>
                  <p className="text-sm opacity-70">{app.userEmail}</p>
                </td>
                <td>{app.loanTitle}</td>
                <td>${app.loanAmount}</td>
                <td>{new Date(app.approvedAt).toLocaleDateString()}</td>
                <td className="text-center">
                  <button
                    className="btn btn-xs btn-info"
                    onClick={() => handleView(app)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedLoans;
