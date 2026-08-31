import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Toaster from "../components/ui/Toaster";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import StoreProvider from "./storeProvider";
import AuthProvider from "@/components/AuthProvider";
<<<<<<< HEAD
import { ApolloClientProvider } from "@/providers/apollo-provider";
=======
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

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
<<<<<<< HEAD
        <ApolloClientProvider>
          <AuthProvider>
            <StoreProvider>
              <Header />
              {children}
              <Toaster />
              <Footer />
            </StoreProvider>
          </AuthProvider>
        </ApolloClientProvider>
=======
        <AuthProvider>
          <StoreProvider>
            <Header />
            {children}
            <Toaster />
            <Footer />
          </StoreProvider>
        </AuthProvider>
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
      </body>
    </html>
  );
}