import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="
      bg-gray-100 dark:bg-neutral-900
      text-gray-700 dark:text-gray-300
      transition-colors duration-300
    ">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-3">
        
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-bold text-primary">LoanLink</h2>
          <p className="mt-4 text-sm leading-relaxed">
            A modern platform to request, manage and track microloans
            with transparency and ease.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link className="hover:text-primary transition" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary transition" to="/loans">
                All Loans
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary transition" to="/dashboard">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Contact</h3>
          <p className="text-sm">support@loanlink.com</p>
          <p className="text-sm mt-2">Dhaka, Bangladesh</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="
        border-t border-gray-300 dark:border-neutral-700
        py-5 text-center text-sm
      ">
        © {new Date().getFullYear()} LoanLink — Built with ❤️ for modern finance
      </div>
    </footer>
  );
};

export default Footer;
