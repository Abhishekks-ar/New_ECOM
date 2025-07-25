
import axios from "axios";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "https://new-ecom-omega.vercel.app/api", 
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
