import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeShare — Real-time code sharing",
  description: "Share code and text instantly with your team. No sign up required.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
