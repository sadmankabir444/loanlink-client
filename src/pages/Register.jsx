import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = e => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const name = form.name.value;
    const photo = form.photo.value;
    const role = form.role.value;
    const email = form.email.value;
    const password = form.password.value;

    if (!/[A-Z]/.test(password)) {
      return setError("Password must have an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      return setError("Password must have a lowercase letter");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    createUser(email, password)
      .then(() => {
        updateUserProfile(name, photo);

        // Save user to DB
        fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, email, role }),
        });

        toast.success("Registration Successful!");
        navigate("/");
      })
      .catch(err => {
        setError(err.message);
        toast.error("Registration Failed");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <form onSubmit={handleRegister} className="card-body">
          <h2 className="text-2xl font-bold text-center">Register</h2>

          <input name="name" placeholder="Full Name" className="input input-bordered" required />
          <input name="photo" placeholder="Photo URL" className="input input-bordered" />
          <input name="email" type="email" placeholder="Email" className="input input-bordered" required />

          <select name="role" className="select select-bordered" required>
            <option value="">Select Role</option>
            <option value="borrower">Borrower</option>
            <option value="manager">Manager</option>
          </select>

          <input name="password" type="password" placeholder="Password" className="input input-bordered" required />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="btn btn-primary">Register</button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
