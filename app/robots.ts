import { MetadataRoute } from "next";

const BASE_URL = "https://ctrl-c-ctrl-v.onrender.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/room/", // room pages are ephemeral, no value indexing them
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
