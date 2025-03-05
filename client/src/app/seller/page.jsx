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
    let isMounted = true; // Prevent state updates after unmounting

    const checkAuth = async () => {
      try {
        const userCookie = Cookies.get("user"); // Get user cookie
        if (!userCookie) {
          if (isMounted) {
            setUser(null);
            router.push("/login"); // Redirect if cookie is missing
          }
          return;
        }

        const response = await fetch("https://api.agiigo.com/api/seller-data", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (isMounted) setUser(data.user);
        } else {
          if (isMounted) {
            setUser(null);
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Auth Error:", error);
        if (isMounted) {
          setUser(null);
          router.push("/login");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <Nav />
      <h1>Welcome {user?.name || "Seller"}!</h1>
      <AddProduct />
      <Footer />
    </>
  );
}
