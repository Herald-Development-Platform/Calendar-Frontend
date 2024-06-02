import axios from "axios";
import Cookies from "js-cookie";

export const baseUrl = "http://localhost:10000/api";

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
