import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yamb Scoreboard",
  description: "Track scores for the Yamb dice game",
  icons: {
    icon: [
      { url: "/jamb/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/jamb/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/jamb/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/jamb/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/jamb/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
