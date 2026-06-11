import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { CartProvider } from "@/components/store/CartContext";
import CartDrawer from "@/components/store/CartDrawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MONVERA CLOTHING | Everyday Excellence",
  description: "Premium streetwear. Heavyweight 285gsm essentials crafted for comfort, quality, and timeless style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`₦{inter.className} bg-[#FFFFFF] text-[#1A1A1A] antialiased selection:bg-[#1A1A1A] selection:text-[#FFFFFF]`}>
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}