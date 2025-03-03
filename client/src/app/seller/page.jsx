"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Nav from "../nav/SellerNav";
import AddProduct from "../pages/addProducts/page";
import Footer from "../footer/Footer";

export default function SellerPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = Cookies.get("user");

    if (!userData) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      if (parsedUser.role !== "seller") {
        router.replace("/buyer");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <h1>Loading...</h1>;

   //return <h1>Welcome {user?.name || "Seller"}!</h1>;

  return (
    <>
      <Nav/>
      <AddProduct/>
      <Footer/>
    </>
  );
}
