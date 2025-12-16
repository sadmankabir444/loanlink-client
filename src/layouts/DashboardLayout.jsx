console.log("🔥 DashboardLayout rendered");




import { Outlet, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen grid md:grid-cols-5">
      {/* Sidebar */}
      <aside className="bg-base-200 p-5 md:col-span-1 min-h-screen">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        <nav className="space-y-2">
          {/* Borrower */}
          {user?.role === "borrower" && (
            <>
              <NavLink to="/dashboard/my-loans" className="block btn btn-ghost">
                My Loans
              </NavLink>
              <NavLink to="/dashboard/profile" className="block btn btn-ghost">
                My Profile
              </NavLink>
            </>
          )}

          {/* Manager */}
          {user?.role === "manager" && (
            <>
              <NavLink to="/dashboard/add-loan" className="block btn btn-ghost">
                Add Loan
              </NavLink>
              <NavLink to="/dashboard/manage-loans" className="block btn btn-ghost">
                Manage Loans
              </NavLink>
              <NavLink to="/dashboard/pending-loans" className="block btn btn-ghost">
                Pending Applications
              </NavLink>
              <NavLink to="/dashboard/approved-loans" className="block btn btn-ghost">
                Approved Applications
              </NavLink>
              <NavLink to="/dashboard/profile" className="block btn btn-ghost">
                My Profile
              </NavLink>
            </>
          )}

          {/* Admin */}
          {user?.role === "admin" && (
            <>
              <NavLink to="/dashboard/manage-users" className="block btn btn-ghost">
                Manage Users
              </NavLink>
              <NavLink to="/dashboard/all-loans" className="block btn btn-ghost">
                All Loans
              </NavLink>
              <NavLink to="/dashboard/applications" className="block btn btn-ghost">
                Loan Applications
              </NavLink>
            </>
          )}
        </nav>
      </aside>

      {/* Content */}
      <main className="md:col-span-4 p-6 bg-base-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
