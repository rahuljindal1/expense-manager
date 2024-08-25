import "./globals.css";
import { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ToastContainer } from "react-toastify";

import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="flex">
          <Sidebar />
          {children}
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
