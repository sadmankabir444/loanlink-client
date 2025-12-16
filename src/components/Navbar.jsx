import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { CiSun, CiDark } from "react-icons/ci";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Logout handler with toast
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const activeClass = "text-primary font-semibold border-b-2 border-primary";
  const normalClass = "hover:text-primary transition";

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          Home
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/loans"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          All Loans
        </NavLink>
      </li>

      {!user ? (
        <>
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? activeClass : normalClass
              }
            >
              Login
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? activeClass : normalClass
              }
            >
              Register
            </NavLink>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? activeClass : normalClass
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li>
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-error text-white"
            >
              Logout
            </button>
          </li>
        </>
      )}
    </>
  );

  return (
    <nav className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50">
      {/* Left */}
      <div className="navbar-start">
        <Link to="/" className="text-2xl font-bold text-primary">
          LoanLink
        </Link>
      </div>

      {/* Center (Desktop) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-4 font-medium">
          {navLinks}
        </ul>
      </div>

      {/* Right */}
      <div className="navbar-end flex items-center gap-3">
        {/* Profile Image */}
        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName || "User"}
            className="w-10 h-10 rounded-full border-2 border-primary object-cover"
          />
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`relative w-14 h-7 rounded-full p-1 bg-white/30 dark:bg-gray-700/30 backdrop-blur-md border border-white/30 dark:border-gray-500 flex items-center transition-colors duration-300`}
          aria-label="Toggle Theme"
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300
      ${theme === "light" ? "translate-x-0" : "translate-x-7"}`}
          >
            {theme === "light" ? (
              <CiSun className="text-yellow-500" size={16} />
            ) : (
              <CiDark className="text-gray-800" size={16} />
            )}
          </span>
        </button>

        {/* Mobile Menu */}
        <div className="dropdown dropdown-end lg:hidden">
          <label tabIndex={0} className="btn btn-ghost text-xl">
            ☰
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            {navLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
