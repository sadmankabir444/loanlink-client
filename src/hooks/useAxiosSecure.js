import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    // REQUEST interceptor
    const reqInterceptor = axiosSecure.interceptors.request.use(
      config => {
        // wait until auth loading finished
        if (loading) {
          return Promise.reject("Auth loading");
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // RESPONSE interceptor
    const resInterceptor = axiosSecure.interceptors.response.use(
      response => response,
      error => {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
          console.log("🔒 Session expired");
          logout?.();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [loading, logout]);

  return axiosSecure;
};

export default useAxiosSecure;
