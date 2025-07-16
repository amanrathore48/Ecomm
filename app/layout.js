import "./globals.css";
import "./typography.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabNav from "@/components/BottomTabNav";
import { FontPreloader } from "@/components/ui/font-preloader";
import { fontSans, fontSerif, fontMono } from "./fonts";

// Font configuration is now handled in app/fonts.js

export const metadata = {
  title: {
    default: "Ecomm - Shopping made easier",
    template: "%s | Ecomm",
  },
  description: "Your one-stop shop for all your shopping needs",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}
    >
      <head />
      <body className="font-sans min-h-screen flex flex-col">
        <FontPreloader />
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-1 pb-24 lg:pb-4">{children}</main>
            <Footer />
            <BottomTabNav />
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
