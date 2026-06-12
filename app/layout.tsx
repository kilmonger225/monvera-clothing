import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { CartProvider } from "@/components/store/CartContext";
import CartDrawer from "@/components/store/CartDrawer";
import { Toaster } from "react-hot-toast"; // <-- Imported the Toaster
import WhatsAppButton from "@/components/ui/WhatsAppButton";

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
      <body className={`${inter.className} bg-[#FFFFFF] text-[#1A1A1A] antialiased selection:bg-[#1A1A1A] selection:text-[#FFFFFF]`}>
        
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="min-h-screen flex flex-col">
            {children}
            <WhatsAppButton />
          </main>
        </CartProvider>

        {/* --> THE TOASTER COMPONENT <-- */}
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#1A1A1A',
              color: '#FFFFFF',
              borderRadius: '0px', 
              fontSize: '14px',
              fontWeight: 'bold',
            },
            success: {
              iconTheme: {
                primary: '#FFFFFF',
                secondary: '#1A1A1A',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#1A1A1A',
              },
            },
          }}
        />

      </body>
    </html>
  );
}