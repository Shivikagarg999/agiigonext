import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // ✅ सही Import
import Buyer from "./pages/buyer/page";
import ProductDetails from "./products/[id]/page";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "Agiigo",
  description: "Ecommerce website Auction based",
  icons: {
    icon: "/images/icon-bgr.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {/* <Buyer/> */}
          {/* <ProductDetails/> */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}