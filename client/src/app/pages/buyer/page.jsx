"use client";

import { useAuth } from "../../../context/AuthContext";
import BrowseByCategory from "@/app/category/page";
import Home from "@/app/home/Home";
import Nav from "@/app/nav/Nav";
import NewArrivals from "@/app/newArrivals/NewArrivals";
import Products from "@/app/products/Products";
import TrendingProducts from "@/app/trendingProducts/TrendingProducts";
import FAQ from "@/app/FAQs/Faqs";
import Footer from "@/app/footer/Footer";
import Features from "@/app/components/Features";

export default function Buyer() {
  const { user } = useAuth();

  console.log("Logged in user:", user);

  return (
    <>
      <Nav />
      <Home />
      <Features />
      {/* {user && (
        <p className="text-center text-green-600 mt-4">
          Welcome back, {user.name}!
        </p>
      )} */}
      <Products />
      <BrowseByCategory />
      <TrendingProducts />
      <NewArrivals />
      <FAQ />
      <Footer />
    </>
  );
}
