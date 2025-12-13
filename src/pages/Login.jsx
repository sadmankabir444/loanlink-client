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

  const handleLogin = e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    login(email, password)
      .then(() => {
        toast.success("Login Successful");
        navigate(from, { replace: true });
      })
      .catch(() => toast.error("Invalid email or password"));
  };

  return (
    <div className="
      min-h-screen flex items-center justify-center
      bg-gradient-to-br
      from-indigo-200 via-purple-200 to-pink-200
      dark:from-indigo-950 dark:via-purple-900 dark:to-pink-950
      transition-colors duration-500
    ">
      <div className="w-full max-w-md bg-base-100/90 dark:bg-base-300/20 backdrop-blur-xl rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

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
              className="absolute right-4 top-3 cursor-pointer"
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="btn btn-primary w-full">Login</button>
        </form>

        <div className="divider">OR</div>

        <button
          onClick={googleLogin}
          className="btn btn-outline w-full flex gap-2"
        >
          <FaGoogle /> Continue with Google
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
