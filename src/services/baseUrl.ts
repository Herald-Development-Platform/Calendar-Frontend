import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
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

// add an interceptor in the axios that will handle the response and then continue to the next step
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // if (error.response.status === 401) {
    //   Cookies.remove("token");
    //   window.location.href = "/login";
    // }

    if (error.response.status >= 400 && error.response.status < 500) {
      console.log("error-----------", error.response.data.message);
      toast.error(error.response.data.message);
    }

    return Promise.reject(error);
  },
);

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
