import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const BASE_URL = "https://ctrl-c-ctrl-v.up.railway.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Real-time Code Sharing — ctrl-c-ctrl-v",
    template: "%s — ctrl-c-ctrl-v",
  },
  description:
    "Instantly share code or text with anyone in real-time. No login, no accounts. Create a room, paste your code, and everyone sees it live.",
  keywords: [
    "code sharing",
    "real-time code share",
    "live code collaboration",
    "share code online",
    "code snippet sharing",
    "developer tool",
    "pair programming",
    "instant code share",
  ],
  authors: [{ name: "ctrl-c-ctrl-v" }],
  creator: "ctrl-c-ctrl-v",
  publisher: "ctrl-c-ctrl-v",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "ctrl-c-ctrl-v",
    title: "ctrl-c-ctrl-v — Real-time Code Sharing",
    description:
      "Instantly share code or text with anyone in real-time. No login required. Rooms vanish when empty.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ctrl-c-ctrl-v — Real-time Code Sharing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ctrl-c-ctrl-v — Real-time Code Sharing",
    description:
      "Instantly share code or text with anyone in real-time. No login required.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
