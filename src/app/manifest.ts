import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Calendar App",
    short_name: "CalendarPWA",
    description: "A Progressive Web App built with Next.js",
    start_url: process.env.NEXT_PUBLIC_DOMAIN_PREFIX || "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "./icons/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "./icons/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
