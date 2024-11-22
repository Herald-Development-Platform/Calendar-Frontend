export const PROCUREMENT_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:9501"
    : "http://10.99.0.35:9501";
