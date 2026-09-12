import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Toaster from "../components/ui/Toaster";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import StoreProvider from "./storeProvider";
import { ApolloClientProvider } from "@/providers/apollo-provider";

const rubik = Rubik({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Giftan",
  description: "Покупка и продажа Telegram подарков",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body
        className={`${rubik.variable} font-sans`}
      >
        <ApolloClientProvider>
            <StoreProvider>
              <Header />
              {children}
              <Toaster />
              <Footer />
            </StoreProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}