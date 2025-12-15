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

// =======================
// Context & Firebase Init
// =======================
export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// =======================
// Auth Provider
// =======================
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =======================
  // REGISTER (Email & Password)
  // =======================
  const register = async (email, password) => {
    setLoading(true);

    // Firebase register
    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Save user to backend (MongoDB)
    await axios.post("http://localhost:3000/users", {
      email,
      role: "borrower",
    });

    return result;
  };

  // =======================
  // LOGIN (Email & Password)
  // =======================
  const login = async (email, password) => {
    setLoading(true);

    // Firebase login
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Backend JWT cookie login
    await axios.post(
      "http://localhost:3000/login",
      { email, password },
      { withCredentials: true }
    );

    return result;
  };

  // =======================
  // GOOGLE LOGIN
  // =======================
  const googleLogin = async () => {
    setLoading(true);

    const result = await signInWithPopup(auth, googleProvider);
    const gUser = result.user;

    // Save Google user to backend
    await axios.post("http://localhost:3000/users", {
      email: gUser.email,
      name: gUser.displayName,
      photo: gUser.photoURL,
      role: "borrower",
    });

    return result;
  };

  // =======================
  // UPDATE PROFILE
  // =======================
  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL,
    });
  };

  // =======================
  // LOGOUT
  // =======================
  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setLoading(false);
  };

  // =======================
  // AUTH STATE OBSERVER
  // =======================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // =======================
  // CONTEXT VALUE
  // =======================
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
