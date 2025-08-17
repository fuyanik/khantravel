import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

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
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/src/assets/images/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 min-h-screen">
       
        {children}
      </body>
    </html>
  );
}
