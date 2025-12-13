import { useEffect, useState } from "react";

const Applications = () => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/loan-applications")
      .then(res => res.json())
      .then(data => setApps(data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Applications</h2>

      {apps.map(app => (
        <div key={app._id} className="border p-4 rounded mb-3">
          <p><strong>{app.loanTitle}</strong></p>
          <p>{app.email}</p>
          <p>Status: {app.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Applications;
