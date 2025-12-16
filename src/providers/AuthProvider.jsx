import { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= REGISTER =================
  // Added 'name' parameter for borrower registration
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Save user to backend with name, email, role
      try {
        await axios.post("http://localhost:3000/users", {
          name,       // <-- important: save name
          email,
          role: "borrower",
        });
      } catch (err) {
        console.error("Backend user creation failed", err);
      }

      return result;
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN =================
  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // backend login (ignore errors)
      try {
        await axios.post(
          "http://localhost:3000/login",
          { email, password },
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Backend login failed, ignoring since Firebase login succeeded", err);
      }

      return result;
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE LOGIN =================
  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const gUser = result.user;

      // Save Google user to backend
      try {
        await axios.post("http://localhost:3000/users", {
          name: gUser.displayName,
          email: gUser.email,
          photo: gUser.photoURL,
          role: "borrower",
        });
      } catch (err) {
        console.error("Backend Google login failed, ignoring", err);
      }

      return result;
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE PROFILE =================
  const updateUserProfile = async (name, photoURL) => {
    if (!auth.currentUser) return;
    return updateProfile(auth.currentUser, { displayName: name, photoURL });
  };

  // ================= LOGOUT =================
  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setLoading(false);
  };

  // ================= AUTH OBSERVER =================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const res = await axios.get(
            `http://localhost:3000/users/${currentUser.email}`
          );
          setUser({ ...currentUser, role: res.data?.role || "borrower" });
        } catch (err) {
          console.error("Failed to fetch role", err);
          setUser({ ...currentUser, role: "borrower" });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    register,
    login,
    googleLogin,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
