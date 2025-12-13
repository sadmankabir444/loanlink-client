import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Login = () => {
  const { loginUser, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [error, setError] = useState("");

  const handleLogin = e => {
    e.preventDefault();
    setError("");
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    loginUser(email, password)
      .then(() => {
        toast.success("Login Successful!");
        navigate(from, { replace: true });
      })
      .catch(err => {
        setError(err.message);
        toast.error("Invalid Email or Password");
      });
  };

  const handleGoogleLogin = () => {
    googleLogin()
      .then(() => {
        toast.success("Google Login Successful!");
        navigate("/");
      })
      .catch(() => toast.error("Google Login Failed"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <form onSubmit={handleLogin} className="card-body">
          <h2 className="text-2xl font-bold text-center">Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="btn btn-primary">Login</button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-outline"
          >
            Continue with Google
          </button>

          <p className="text-center text-sm">
            New here?{" "}
            <Link to="/register" className="text-primary font-semibold">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
