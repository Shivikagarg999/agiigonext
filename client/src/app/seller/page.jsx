"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Nav from "../nav/SellerNav";
import AddProduct from "../pages/addProducts/page";
import Footer from "../footer/Footer";

export default function SellerPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token"); // Check if token exists
    const userData = Cookies.get("user");

    console.log("Token:", token);
    console.log("User Data:", userData);

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData)); // Parse user data safely
    } catch (error) {
      console.error("Error parsing user data:", error);
      Cookies.remove("user"); // Remove corrupted cookie
      router.push("/login");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Nav />
      <h1>Welcome {user?.name || "Seller"}!</h1>
      <AddProduct />
      <Footer />
    </>
  );
}