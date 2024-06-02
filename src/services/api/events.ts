import { getCookie } from "@/hooks/CookieHooks";
import { baseUrl } from "../baseUrl";
import Cookies from "js-cookie";

const postEvent = (payload: any) =>
  fetch(`${baseUrl}/event`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  }).then((res) => res.json());
