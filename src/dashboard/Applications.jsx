import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";

const Applications = () => {
  const axiosSecure = useAxiosSecure();
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const res = await axiosSecure.get(
        `/admin/loan-applications?status=${status}&page=${page}&limit=${limit}`
      );

      setApplications(res.data.applications || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // IMPORTANT: dependency limited
  }, [status, page]);

  const handleView = (app) => {
    Swal.fire({
      title: "Loan Application Details",
      width: 650,
      html: `
        <div style="text-align:left">
          <p><b>User:</b> ${app.userName || ""} (${app.userEmail || ""})</p>
          <p><b>Loan Title:</b> ${app.loanTitle || ""}</p>
          <p><b>Category:</b> ${app.loanCategory || ""}</p>
          <p><b>Amount:</b> $${app.loanAmount || ""}</p>
          <p><b>Status:</b> ${app.status || ""}</p>
          <p><b>Applied Date:</b> ${app.createdAt ? new Date(app.createdAt).toLocaleDateString() : ""}</p>
          <p><b>Address:</b> ${app.address || ""}</p>
          <p><b>Reason:</b> ${app.reason || ""}</p>
        </div>
      `,
    });
  };

  if (loading) return <LoadingSpinner />;

  const filteredApplications = applications.filter(
    (app) =>
      (app.userName || "").toLowerCase().includes(search.toLowerCase()) ||
      (app.userEmail || "").toLowerCase().includes(search.toLowerCase()) ||
      (app.loanTitle || "").toLowerCase().includes(search.toLowerCase()) ||
      (app.loanCategory || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <h2 className="text-3xl font-bold text-primary">Loan Applications</h2>

        <div className="flex gap-2 flex-col md:flex-row w-full md:w-auto">
          <select
            className="select select-bordered w-full md:w-56"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Applications</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <input
            type="text"
            placeholder="Search by name or title"
            className="input input-bordered w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table className="table table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th>Loan ID</th>
              <th>User</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app._id}>
                <td>{app._id?.slice(0, 6)}...</td>
                <td>
                  <p className="font-semibold">{app.userName || ""}</p>
                  <p className="text-sm opacity-70">{app.userEmail || ""}</p>
                </td>
                <td>{app.loanCategory || ""}</td>
                <td>${app.loanAmount || ""}</td>
                <td>
                  <span
                    className={`badge ${
                      app.status === "Approved"
                        ? "badge-success"
                        : app.status === "Rejected"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {app.status || ""}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    onClick={() => handleView(app)}
                    className="btn btn-xs btn-info"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filteredApplications.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  No applications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex justify-center gap-2">
        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num}
            onClick={() => setPage(num + 1)}
            className={`btn btn-sm ${page === num + 1 ? "btn-primary" : ""}`}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Applications;
