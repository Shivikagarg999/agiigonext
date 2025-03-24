"use client"
import { useState } from "react";
import { ChevronDown, User, Search, ShoppingCart, Heart, Menu, X } from "lucide-react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  

const goToCart = () => {
  router.push("/cart");  // Navigate to cart
};

  return (
    <nav className="bg-white py-5 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <a href="#" className="text-2xl font-bold text-[#EB8426]">
          <img src="/images/logo.jpg" className="h-8"></img>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center space-x-8 text-lg font-semibold">
          <li><a href="/" className="text-gray-700 hover:text-black">Home</a></li>
          <li className="flex items-center space-x-1">
            <a href="/shop" className="text-gray-700 hover:text-black">Shop</a>
            <ChevronDown className="h-5 w-5 text-gray-700" />
          </li>
          <li><a href="/about" className="text-gray-700 hover:text-black">About</a></li>
          <li><a href="#" className="text-gray-700 hover:text-black">Contact</a></li>
        </ul>

        {/* Right Section (Icons & Login) */}
        <div className="hidden lg:flex items-center space-x-4">
          <User className="h-6 w-6 text-[#EB8426]" />
          <a href="/login" className="text-[#EB8426] font-semibold">Login / Register</a>
          {/* <a href="/pages/addProducts" className="text-[#EB8426] font-semibold">Add Product</a> */}
          <Search className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer" />
          <ShoppingCart className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer" />
          <Heart className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer" />
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden focus:outline-none">
          {isOpen ? <X className="h-8 w-8 text-gray-700" /> : <Menu className="h-8 w-8 text-gray-700" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md py-4 px-6">
          <ul className="flex flex-col space-y-4 text-lg font-semibold">
            <li><a href="/" className="text-gray-700 hover:text-black">Home</a></li>
            <li><a href="/shop" className="text-gray-700 hover:text-black">Shop</a></li>
            <li><a href="/about" className="text-gray-700 hover:text-black">About</a></li>
            <li><a href="#" className="text-gray-700 hover:text-black">Contact</a></li>
            <li>
              <div className="flex items-center space-x-4">
                <User className="h-6 w-6 text-[#EB8426]" />
                <a href="/login" className="text-[#EB8426] font-semibold">Login / Register</a>
              </div>
            </li>
            <li className="flex space-x-4">
              <Search className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer" />
              <ShoppingCart
      className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer"
      onClick={goToCart}
    />
              <Heart className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer" />
            </li>
          </ul>
        </div>
      )}

    </nav>
    
  );
}