import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const BASE_URL = "https://ctrl-c-ctrl-v.up.railway.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ctrl-c-ctrl-v — Real-time Code Sharing",
    template: "%s | ctrl-c-ctrl-v",
  },
  description:
    "Share code and text instantly with your team. Create a room, post snippets, everyone sees it live. No sign up, no accounts — just a room code.",
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
      "Share code and text instantly with your team. No sign up. No accounts. Just a room code.",
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
      "Share code and text instantly with your team. No sign up. No accounts. Just a room code.",
    images: ["/og-image.png"],
    creator: "@ctrlcctrlv",
  },
  alternates: {
    canonical: BASE_URL,
  },
  // Google Search Console verification
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
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
