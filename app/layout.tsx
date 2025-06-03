import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
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
  title: "brand4print",
  description: "At Brand4Print, we take pride in delivering printing solutions that elevate your brand to new heights. With our dedication to quality craftsmanship, customizable options, and competitive pricing, we stand as your top choice in Enfield. Whether you need personalized paper bags or vibrant stickers, we offer the perfect blend of excellence and affordability. Trust us to bring your brand vision to life, one print at a time.",
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
      >        <ToastProvider>
          <Toaster position="top-center" />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
