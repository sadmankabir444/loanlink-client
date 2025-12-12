// src/context/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // get id token
        const idToken = await u.getIdToken();
        // set cookie for server calls (you can later replace with HttpOnly cookie via server)
        document.cookie = `token=${idToken}; path=/;`;
        // optionally upsert user to server
        try {
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/register`, {
            name: u.displayName || "",
            email: u.email,
            // we don't send password
            photoURL: u.photoURL || "",
            role: "borrower"
          }).catch(()=>{/* ignore if already exists */});
        } catch (err) {
          // ignore
        }
        setUser(u);
      } else {
        // clear cookie
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
    // cookie cleared by onAuthStateChanged
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
