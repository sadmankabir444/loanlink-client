import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = (email) => {
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    const fetchRole = async () => {
      try {
        const res = await axiosSecure.get(`/users?email=${email}`);
        const userData = res.data[0];
        setRole(userData?.role || "borrower");
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        setRole("borrower"); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [email, axiosSecure]);

  return [role, loading];
};

export default useUserRole;
