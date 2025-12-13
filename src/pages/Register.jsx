import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("borrower");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Password validation
    if (!/[A-Z]/.test(password)) return toast.error("Password must contain at least 1 uppercase letter");
    if (!/[a-z]/.test(password)) return toast.error("Password must contain at least 1 lowercase letter");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL,
      });

      toast.success("Registration successful!");
      navigate("/dashboard"); // redirect after registration
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Register</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input input-bordered w-full"/>
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Photo URL</label>
            <input type="text" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} className="input input-bordered w-full"/>
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input input-bordered w-full"/>
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="select select-bordered w-full">
              <option value="borrower">Borrower</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input input-bordered w-full"/>
          </div>

          <button type="submit" className="btn btn-primary w-full">Register</button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
