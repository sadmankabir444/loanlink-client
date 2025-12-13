import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

const Login = () => {
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false); // Login button loading state

  // =====================
  // Email / Password Login
  // =====================
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      setLoading(true);
      await login(email, password);
      toast.success("Login successful 🎉");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // Google Login
  // =====================
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await googleLogin();
      toast.success("Google login successful 🎉");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
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
        from-indigo-200 via-purple-200 to-pink-200
        dark:from-indigo-950 dark:via-purple-900 dark:to-pink-950
        transition-colors duration-500
      "
    >
      <div className="w-full max-w-md bg-base-100/90 dark:bg-base-300/20 backdrop-blur-xl rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome Back 👋
        </h2>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            required
          />

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
};

export default Login;
