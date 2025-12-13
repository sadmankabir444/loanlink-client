import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const { register, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const handleRegister = e => {
    e.preventDefault();
    const { name, photo, email, password, role } = e.target;

    if (!/[A-Z]/.test(password.value))
      return toast.error("Password must contain uppercase");
    if (!/[a-z]/.test(password.value))
      return toast.error("Password must contain lowercase");
    if (password.value.length < 6)
      return toast.error("Minimum 6 characters");

    register(email.value, password.value)
      .then(() => {
        updateUserProfile(name.value, photo.value);

        fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: name.value,
            email: email.value,
            role: role.value,
          }),
        });

        toast.success("Registration successful");
        navigate("/");
      })
      .catch(() => toast.error("Registration failed"));
  };

  return (
    <div className="
      min-h-screen flex items-center justify-center
      bg-gradient-to-br
      from-pink-200 via-purple-200 to-indigo-200
      dark:from-pink-950 dark:via-purple-900 dark:to-indigo-950
      transition-colors duration-500
    ">
      <div className="w-full max-w-lg bg-base-100/90 dark:bg-base-300/20 backdrop-blur-xl rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input name="name" placeholder="Full Name" className="input input-bordered w-full" required />
          <input name="photo" placeholder="Photo URL" className="input input-bordered w-full" />
          <input name="email" type="email" placeholder="Email" className="input input-bordered w-full" required />

          <select name="role" className="select select-bordered w-full" required>
            <option value="">Select Role</option>
            <option value="borrower">Borrower</option>
            <option value="manager">Manager</option>
          </select>

          <div className="relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full"
              required
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-3 cursor-pointer"
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="btn btn-primary w-full">Register</button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
