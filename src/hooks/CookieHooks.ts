import { useEffect, useState } from "react";

export function useGetCookieByName(cookieName: string): string | undefined {
  const [cookie, setCookie] = useState<any>();

  useEffect(() => {
    const cookies = document?.cookie?.split("; ");

    for (let i = 0; i < cookies.length; i++) {
      const [name, value] = cookies[i].split("=");
      if (name === cookieName) {
        setCookie(value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookieName]);
  return cookie;
}
export function getCookie(cookieName: string) {
  const cookies = document?.cookie?.split("; ");

  for (let i = 0; i < cookies.length; i++) {
    const [name, value] = cookies[i].split("=");
    if (name === cookieName) return value;
  }
}
export function useSetCookie(cookieName: string, value: string, days: number) {
  useEffect(() => {
    setCookie(cookieName, value, days);
  }, [cookieName, days, value]);
}
export function setCookie(cookieName: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();

  document.cookie =
    cookieName + "=" + encodeURIComponent(value) + "; expires=" + expires;
}
export function useDeleteAllCookies() {
  useEffect(() => {
    deleteAllCookies();
  }, []);
}

export function useDeleteCookieByName(cookieName: string) {
  useEffect(() => {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  });
}

export function deleteAllCookies() {
  let cookies = document.cookie.split(";");

  // Iterate through each cookie and delete it
  cookies.forEach(function (cookie) {
    let cookieParts = cookie.split("=");
    let cookieName = cookieParts[0].trim();
    document.cookie =
      cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });
}
