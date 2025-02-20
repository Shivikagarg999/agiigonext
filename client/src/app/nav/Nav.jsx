"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, User, ShoppingCart, Heart, Menu, X, Search } from "lucide-react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const [activePath, setActivePath] = useState("/");

  useEffect(() => {
    setActivePath(window.location.pathname);
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white py-5 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center px-6">
        <a href="/" className="text-2xl font-bold text-[#EB8426]">
          <img src="/images/logo.jpg" className="h-8" alt="Logo" />
        </a>

        <ul className="hidden lg:flex items-center space-x-8 text-lg font-semibold">
          <li>
            <a href="/" className={`text-gray-700 hover:text-black ${activePath === "/" ? "border-b-2 border-[#EB8426]" : ""}`}>Home</a>
          </li>
          <li className="flex items-center space-x-1">
            <a href="/shop" className={`text-gray-700 hover:text-black ${activePath === "/shop" ? "border-b-2 border-[#EB8426]" : ""}`}>Shop</a>
            <ChevronDown className="h-5 w-5 text-gray-700" />
          </li>
          <li>
            <a href="/about" className={`text-gray-700 hover:text-black ${activePath === "/about" ? "border-b-2 border-[#EB8426]" : ""}`}>About</a>
          </li>
          <li>
            <a href="/contact" className={`text-gray-700 hover:text-black ${activePath === "/contact" ? "border-b-2 border-[#EB8426]" : ""}`}>Contact</a>
          </li>
        </ul>

        <div className="hidden lg:flex items-center space-x-4">
          <User className="h-6 w-6 text-[#EB8426]" />
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-[#EB8426] font-semibold">Logout</button>
          ) : (
            <a href="/login" className="text-[#EB8426] font-semibold">Login / Register</a>
          )}
          <a href="/pages/addProducts" className="text-[#EB8426] font-semibold">Add Product</a>
          <ShoppingCart className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer" />
          <Heart className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer" />
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden focus:outline-none">
          {isOpen ? <X className="h-8 w-8 text-gray-700" /> : <Menu className="h-8 w-8 text-gray-700" />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white shadow-md py-4 px-6">
          <ul className="flex flex-col space-y-4 text-lg font-semibold">
            <li>
              <a href="/" className={`text-gray-700 hover:text-black ${activePath === "/" ? "border-b-2 border-[#EB8426]" : ""}`}>Home</a>
            </li>
            <li>
              <a href="/shop" className={`text-gray-700 hover:text-black ${activePath === "/shop" ? "border-b-2 border-[#EB8426]" : ""}`}>Shop</a>
            </li>
            <li>
              <a href="/about" className={`text-gray-700 hover:text-black ${activePath === "/about" ? "border-b-2 border-[#EB8426]" : ""}`}>About</a>
            </li>
            <li>
              <a href="/contact" className={`text-gray-700 hover:text-black ${activePath === "/contact" ? "border-b-2 border-[#EB8426]" : ""}`}>Contact</a>
            </li>
            <li>
              <div className="flex items-center space-x-4">
                <User className="h-6 w-6 text-[#EB8426]" />
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="text-red-500 font-semibold">Logout</button>
                ) : (
                  <a href="/login" className="text-[#EB8426] font-semibold">Login / Register</a>
                )}
              </div>
            </li>
            <li className="flex space-x-4">
              <ShoppingCart className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer" />
              <Heart className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer" />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}