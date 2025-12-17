import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://loanlink-server-seven.vercel.app",
  withCredentials: true, // 🔥 MUST
});

export default axiosSecure;
