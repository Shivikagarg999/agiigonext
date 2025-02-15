"use client";

import { useState } from "react";
import { UserIcon, ChevronDownIcon, MagnifyingGlassIcon, ShoppingCartIcon, HeartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="h-auto bg-gray-100">
      {/* Navbar */}

      {/* Hero Section */}
      <header 
        className="bg-[url('/images/header-bg.jpeg')] bg-cover bg-center bg-no-repeat text-white py-10 
                   min-h-[50vh] md:min-h-screen w-full flex items-center"
      >
        <div className="container text-black mx-auto px-6 md:px-12 lg:px-20 w-full flex flex-col items-start justify-start">
          <h2 className="text-4xl md:text-5xl font-bold">Style Redefined</h2>
          <p className="mt-3 text-lg md:text-xl">We know how large objects will act, but things on a small scale.</p>
          
          {/* Search bar */}
          <div className="mt-6 flex items-center relative w-full max-w-lg">
            <input 
              type="text" 
              placeholder="Search everything" 
              className="px-4 py-3 w-full rounded-full shadow-md focus:outline-none text-gray-900"
            />
            <button className="absolute right-4 text-[#EB8426] hover:text-black">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
          </div>

          {/* CTA Button */}
          <button className="mt-6 bg-[#EB8426] text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md">
            Shop Now
          </button>
        </div>
      </header>
    </div>
  );
}