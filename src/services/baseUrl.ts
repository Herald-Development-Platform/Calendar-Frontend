import axios from "axios";
import Cookies from "js-cookie";
// "https://calendar-backend-txel.onrender.com/api";

export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://10.99.0.35:10000/api"
    : "http://10.99.0.35:10000/api"


export const webSocketUrl =
  process.env.NODE_ENV === "development"
    ? "http://10.99.0.35:10000"
    : "http://10.99.0.35:10000"

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
