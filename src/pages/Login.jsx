// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import useAuth from "../hooks/useAuth"; // ✅ default import
import axiosSecure from "../api/axiosSecure";

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // =====================
  // Email / Password Login
  // =====================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1️⃣ Firebase login
      const result = await login(email, password);
      const user = result.user;

      // 2️⃣ Backend JWT login (cookie)
      await axiosSecure.post("/login", { email: user.email });

      toast.success("Login successful 🎉");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // Google Login
  // =====================
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await googleLogin();
      toast.success("Google login successful 🎉");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Google login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-950 dark:via-purple-900 dark:to-pink-950 transition-colors duration-500">
      <div className="w-full max-w-md bg-base-100/90 dark:bg-base-300/20 backdrop-blur-xl rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back 👋</h2>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-3 cursor-pointer opacity-70"
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>

        <div className="divider">OR</div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className={`btn btn-outline w-full flex gap-2 justify-center ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          <FaGoogle />
          {loading ? "Processing..." : "Continue with Google"}
        </button>

        <p className="text-center mt-4 text-sm">
          New here?{" "}
          <Link to="/register" className="link link-primary">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
