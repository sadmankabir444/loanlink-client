// src/pages/Register.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // basic client-side validation already done by react-hook-form rules
      const { name, email, password, photoURL, role } = data;

      // 1) Create in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // 2) Update profile (displayName, photoURL)
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL || "",
      });

      // 3) Send to server to register (store hashed password & role)
      // NOTE: server route expects { name, email, password } per earlier backend routes
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/register`,
        { name, email, password, role: role || "borrower" },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Registration successful — Redirecting...");
      reset();

      // small delay to allow onAuthStateChanged in AuthProvider to set token cookie
      setTimeout(() => {
        navigate("/");
      }, 900);
    } catch (err) {
      console.error("Register error:", err);
      // firebase errors have code/message
      const message = err?.response?.data?.message || err?.message || "Registration failed";
      toast.error(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create your account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="input input-bordered w-full mt-1"
            placeholder="Your full name"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
            })}
            className="input input-bordered w-full mt-1"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Photo URL */}
        <div>
          <label className="block text-sm font-medium">Photo URL (optional)</label>
          <input
            {...register("photoURL")}
            className="input input-bordered w-full mt-1"
            placeholder="https://..."
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            {...register("role")}
            className="select select-bordered w-full mt-1"
            defaultValue="borrower"
          >
            <option value="borrower">Borrower</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
              validate: {
                hasUpper: (v) =>
                  /[A-Z]/.test(v) || "Password must contain at least one uppercase letter",
                hasLower: (v) =>
                  /[a-z]/.test(v) || "Password must contain at least one lowercase letter",
              },
            })}
            className="input input-bordered w-full mt-1"
            placeholder="Your password"
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create account"}
          </button>

          <Link to="/login" className="text-sm link">
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  );
}
