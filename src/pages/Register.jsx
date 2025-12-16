import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

const Register = () => {
  const { register, updateUserProfile, googleLogin } = useContext(AuthContext);

  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // =======================
  // Email / Password Register
  // =======================
  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value;
    const photo = form.photo.value;
    const email = form.email.value;
    const password = form.password.value;
    const role = form.role.value;

    // Password validation
    if (!/[A-Z]/.test(password))
      return toast.error("Password must contain uppercase");
    if (!/[a-z]/.test(password))
      return toast.error("Password must contain lowercase");
    if (password.length < 6)
      return toast.error("Minimum 6 characters required");

    try {
      setLoading(true);

      // ✅ FIX: pass name + email + password
      await register(name, email, password);

      // Update Firebase profile
      await updateUserProfile(name, photo);

      toast.success("Registration successful 🎉");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // Google Login
  // =======================
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await googleLogin();
      const gUser = result.user;

      toast.success("Google login successful 🎉");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen flex items-center justify-center
        bg-gradient-to-br
        from-pink-200 via-purple-200 to-indigo-200
        dark:from-pink-950 dark:via-purple-900 dark:to-indigo-950
        transition-colors duration-500
      "
    >
      <div className="w-full max-w-lg bg-base-100/90 dark:bg-base-300/20 backdrop-blur-xl rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account 🚀
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            className="input input-bordered w-full"
            required
          />

          <input
            name="photo"
            placeholder="Photo URL (optional)"
            className="input input-bordered w-full"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            required
          />

          <select
            name="role"
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Role</option>
            <option value="borrower">Borrower</option>
            <option value="manager">Manager</option>
          </select>

          <div className="relative w-full">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full pr-12 z-10 relative"
              required
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer text-gray-600 hover:text-gray-900"
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>

        <div className="divider">OR</div>

        <button
          onClick={handleGoogleLogin}
          className={`btn btn-outline w-full flex justify-center gap-2 ${
            loading ? "loading" : ""
          }`}
          disabled={loading}
        >
          <FaGoogle />
          Continue with Google
        </button>

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
