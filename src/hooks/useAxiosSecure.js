import axios from "axios";
import { useEffect } from "react";

const useAxiosSecure = () => {
  const token = localStorage.getItem("access-token"); // অথবা cookie থেকে

  const axiosSecure = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Optional: response interceptor
  axiosSecure.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        console.log("Unauthorized / Forbidden - token invalid or expired");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
