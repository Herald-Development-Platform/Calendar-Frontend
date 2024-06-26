import axios from "axios";
import Cookies from "js-cookie";

export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:10000/api"
    // : "https://calendar-backend-hbvl.onrender.com/api";
: "http://localhost:10000/api";

export const webSocketUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:10000"
    // : "https://calendar-backend-hbvl.onrender.com";
: "http://localhost:10000";

export const Axios = axios.create({
  baseURL: baseUrl,
});

Axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
