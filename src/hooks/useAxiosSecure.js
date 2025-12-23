import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Axios instance
const axiosSecure = axios.create({
  baseURL: "https://loanlink-server-seven.vercel.app",
  withCredentials: true, 
});

const useAxiosSecure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        config.withCredentials = true;
        return config;
      },
      (error) => Promise.reject(error)
    );

    
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
          console.log("❌ Unauthorized");
          navigate("/login", { replace: true });
        }

        return Promise.reject(error);
      }
    );

    // cleanup
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return axiosSecure;
};

export default useAxiosSecure;