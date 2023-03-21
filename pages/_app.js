import "../styles/globals.css";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import PhoneMenu from "@/components/PhoneMenu";
import { SessionProvider } from "next-auth/react";
import CartProvider from "@/hooks/useCart";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <CartProvider>
          <Header />
          <Component {...pageProps} />
          <Footer />
          <PhoneMenu />
        </CartProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
