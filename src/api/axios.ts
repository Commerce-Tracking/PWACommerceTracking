import axios from "axios";

// const baseURL = "/api"; // Utiliser le proxy Vite

const axiosInstance = axios.create({ baseURL: "" });

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers.Accept = "application/json";
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;