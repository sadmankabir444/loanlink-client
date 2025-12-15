import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = email => {
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    axiosSecure.get(`/admin/users/${email}`).then(res => {
      setRole(res.data.role);
      setLoading(false);
    });
  }, [email, axiosSecure]);

  return [role, loading];
};

export default useUserRole;
