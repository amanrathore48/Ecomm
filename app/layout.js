import "./globals.css";
import { Montserrat, Poppins, Inter } from "next/font/google";
import { ThemeProvider, Providers } from "@/app/providers";

// Import components
import Header from "@/components/Header";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { Toaster } from "@/components/ui/toaster";
import BottomTabNav from "@/components/BottomTabNav";

// Define fonts
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Ecomm - Modern E-commerce Store",
  description: "Premium products at affordable prices",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${poppins.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background font-sans antialiased">
        <ThemeProvider>
          <Providers>
            <Header />
            <main className="flex-grow pb-16 lg:pb-0">{children}</main>
            <BottomTabNav />
            <FooterWrapper />
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
