import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ayede Staff Voting Site",
    template: "%s | Ayede Staff Voting Site",
  },
  metadataBase: new URL("https://votingsystem-flax.vercel.app"),
  description:
    "Voting System is a digital platform designed to manage and conduct elections securely and efficiently. It allows eligible users to cast votes for candidates, ensures that each voter can vote only once, and automatically tallies the results.",
  openGraph: {
    title: "Voting System",
    description:
      "Voting System is a digital platform designed to manage and conduct elections securely and efficiently. It allows eligible users to cast votes for candidates, ensures that each voter can vote only once, and automatically tallies the results.",
    url: "https://votingsystem-flax.vercel.app",
    siteName: "Voting System",
    images: {
      url: "/Captureone.PNG",
      width: 1200,
      height: 630,
      alt: "Voting System",
    },
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-center" />
        <Provider>
          <div className="md:w-auto w-[95%] mx-auto">{children}</div>
        </Provider>
      </body>
    </html>
  );
}
