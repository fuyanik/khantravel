import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../lib/storage-polyfill";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Khan Travel",
  description: "Premium transfer and hourly rental services for your comfortable journey in Istanbul, Turkey",
  keywords: "Istanbul transfer, airport transfer, car rental, premium transport, Turkey travel",
  authors: [{ name: "Khan Travel" }],
  icons: {
    icon: "/src/assets/images/favicon.ico",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 min-h-screen flex flex-col">
       
        <main className="flex-1">
          {children}
        </main>
       
      </body>
    </html>
  );
}
