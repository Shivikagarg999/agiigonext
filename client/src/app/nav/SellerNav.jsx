"use client";

import { useState, useEffect } from "react";
import { ChevronDown, User, Menu, X } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Nav() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSeller, setIsSeller] = useState(true); // Assume user is a seller
  const [userId, setUserId] = useState("");

  // Ensure userId is retrieved only after hydration
  useEffect(() => {
    try {
      const user = JSON.parse(Cookies.get("user") || "{}");
      setUserId(user._id || "");
    } catch (error) {
      console.error("Error parsing user cookie:", error);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("https://api.agiigo.com/api/logout", {
        method: "POST",
        credentials: "include",
      });
  
      if (response.ok) {
        Cookies.remove("token"); // Ensure JWT token is removed
        Cookies.remove("user"); // Remove user data
  
        setUserId("");  // Clear user state
        setIsSeller(false); // Ensure UI updates
  
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };  

  return (
    <nav className="bg-white py-5 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <a href="#" className="text-2xl font-bold text-[#EB8426]">
          <img src="/images/logo.jpg" className="h-8" alt="Logo" />
        </a>

        <ul className="hidden lg:flex items-center space-x-8 text-lg font-semibold">
          <li><a href="/seller" className="text-gray-700 hover:text-black">Home</a></li>
          <li className="flex items-center space-x-1">
            <a href="/shop" className="text-gray-700 hover:text-black">Shop</a>
            <ChevronDown className="h-5 w-5 text-gray-700" />
          </li>
          <li><a href="/about" className="text-gray-700 hover:text-black">About</a></li>
          <li><a href="/contact" className="text-gray-700 hover:text-black">Contact</a></li>
          {isSeller && <li><a href="/my-products" className="text-gray-700 hover:text-black">My Products</a></li>}
        </ul>

        <div className="hidden lg:flex items-center space-x-4">
          {userId && (
            <a 
              href={`/seller/profile/${userId}`} 
              className="text-[#EB8426] hover:text-black flex items-center space-x-1"
            >
              <User className="h-6 w-6" />
              <span>Profile</span>
            </a>
          )}

          {isSeller && <a href="/seller" className="text-[#EB8426] font-semibold">Add Product</a>}
          {isSeller ? (
            <button onClick={handleLogout} className="text-[#EB8426] font-semibold">Logout</button>
          ) : (
            <a href="/login" className="text-[#EB8426] font-semibold">Login / Register</a>
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden focus:outline-none">
          {isOpen ? <X className="h-8 w-8 text-gray-700" /> : <Menu className="h-8 w-8 text-gray-700" />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white shadow-md py-4 px-6">
          <ul className="flex flex-col space-y-4 text-lg font-semibold">
            <li><a href="/seller" className="text-gray-700 hover:text-black">Home</a></li>
            <li><a href="/shop" className="text-gray-700 hover:text-black">Shop</a></li>
            <li><a href="/about" className="text-gray-700 hover:text-black">About</a></li>
            <li><a href="/contact" className="text-gray-700 hover:text-black">Contact</a></li>
            {isSeller && <li><a href="/my-products" className="text-gray-700 hover:text-black">My Products</a></li>}
            {userId && (
              <li>
                <a 
                  href={`/seller/profile/${userId}`} 
                  className="text-[#EB8426] hover:text-black flex items-center space-x-1"
                >
                  <User className="h-6 w-6" />
                  <span>Profile</span>
                </a>
              </li>
            )}
            <li>
              {isSeller ? (
                <button onClick={handleLogout} className="text-[#EB8426] font-semibold">Logout</button>
              ) : (
                <a href="/login" className="text-[#EB8426] font-semibold">Login / Register</a>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}