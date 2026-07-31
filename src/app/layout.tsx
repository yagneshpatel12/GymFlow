import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getgymflow.vercel.app"),
  title: {
    default: "GymFlow - Gym Management Software That Runs Itself",
    template: "%s · GymFlow",
  },
  description:
    "GymFlow is the all-in-one platform for modern gyms - members, class scheduling, attendance, trainers, billing and analytics in one beautiful dashboard.",
  keywords: [
    "gym management software",
    "fitness studio software",
    "membership management",
    "class scheduling",
    "gym CRM",
  ],
  authors: [{ name: "Yagnesh Patel", url: "https://yagneshpateldev.com" }],
  openGraph: {
    title: "GymFlow - Gym Management Software That Runs Itself",
    description:
      "Run your entire gym from one beautiful dashboard. Members, classes, attendance, billing and analytics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
