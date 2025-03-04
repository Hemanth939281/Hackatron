"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "./components/Header";
import { Provider } from "react-redux";
import appStore from "./utils/store/appStore";
import AOSProvider from "./utils/AOSProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  

  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AOSProvider>
        <Provider store={appStore}>
           <Toaster position="top-center" richColors />
           <Header />
        {children}
        </Provider>
        </AOSProvider>

      </body>
    </html>
  );
}
