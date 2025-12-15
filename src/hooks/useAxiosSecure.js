import axios from "axios";

const useAxiosSecure = () => {
  const axiosSecure = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true, // ✅ JWT cookie based auth
  });

  // =========================
  // Response Interceptor
  // =========================
  axiosSecure.interceptors.response.use(
    response => response,
    error => {
      const status = error.response?.status;

      if (status === 401) {
        console.log("❌ Unauthorized: Login required");
      }

      if (status === 403) {
        console.log("⛔ Forbidden: No access permission");
      }

      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
