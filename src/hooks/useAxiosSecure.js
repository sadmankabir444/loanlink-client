import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://loanlink-server-seven.vercel.app",
  withCredentials: true,
});

axiosSecure.interceptors.request.use(
  (config) => {
    
    return config;
  },
  (error) => Promise.reject(error)
);

axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.log("❌ Unauthorized");
    }

    if (status === 403) {
      console.log("⛔ Forbidden");
    }

    return Promise.reject(error);
  }
);

const useAxiosSecure = () => axiosSecure;

export default useAxiosSecure;
