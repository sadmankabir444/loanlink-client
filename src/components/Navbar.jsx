import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { CiSun, CiDark } from "react-icons/ci";
// import { useTheme } from "../context/ThemeProvider";

export default function Navbar() {
  const [theme, setTheme] = useState("light");
  

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const navItems = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/all-loans">All Loans</NavLink></li>
      <li><NavLink to="/login">Login</NavLink></li>
      <li><NavLink to="/register">Register</NavLink></li>
    </>
  );

  

  return (
    <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50">
      <div className="navbar-start">
        <Link className="text-2xl font-bold text-primary" to="/">
          LoanLink
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium">
          {navItems}
        </ul>
      </div>

      <div className="navbar-end flex items-center gap-4">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="btn btn-sm btn-outline">
          {theme === "light" ? <CiDark size={20} /> : <CiSun size={20} />}
        </button>

        {/* Mobile Menu */}
        <div className="dropdown dropdown-end lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            ☰
          </label>
          <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-3">
            {navItems}
          </ul>
        </div>
      </div>
    </div>
  );
}
