import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { CiSun, CiDark } from "react-icons/ci";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const navLinks = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/loans">All Loans</NavLink></li>

      {!user ? (
        <>
          <li><NavLink to="/login">Login</NavLink></li>
          <li><NavLink to="/register">Register</NavLink></li>
        </>
      ) : (
        <>
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li>
            <button
              onClick={logout}
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
    <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50">
      {/* Left */}
      <div className="navbar-start">
        <Link to="/" className="text-2xl font-bold text-primary">
          LoanLink
        </Link>
      </div>

      {/* Center (Desktop) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium gap-2">
          {navLinks}
        </ul>
      </div>

      {/* Right */}
      <div className="navbar-end flex items-center gap-3">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="btn btn-sm btn-outline">
          {theme === "light" ? <CiDark size={20} /> : <CiSun size={20} />}
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
    </div>
  );
};

export default Navbar;
