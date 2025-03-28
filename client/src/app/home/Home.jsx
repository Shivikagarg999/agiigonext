"use client";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <header 
        className="relative bg-[url('/images/topimg.jpeg')] bg-cover bg-center bg-no-repeat 
                   text-white min-h-[70vh] md:min-h-[80vh] w-full flex items-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/5">
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 lg:px-24 w-full relative z-10">
          <div className="max-w-2xl px-4 py-8 md:px-8 md:py-12 rounded-lg">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Style <span className="text-[#EB8426]">Redefined</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed">
              Discover premium fashion that blends quality with contemporary design. 
              We know how large objects will act, but things on a small scale.
            </p>
            
            {/* Search bar */}
            <div className="mb-8 relative w-full max-w-xl mx-auto">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more..." 
                className="px-6 py-3 w-full rounded-full shadow-lg focus:outline-none 
                          focus:ring-2 focus:ring-[#EB8426] text-gray-800 placeholder-gray-500"
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#EB8426] 
                          p-2 rounded-full hover:bg-orange-700 transition-colors"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* CTA Buttons with Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <Link 
                href="/shop" 
                className="bg-[#EB8426] hover:bg-orange-700 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-full 
                          text-base sm:text-lg font-semibold shadow-lg transition-all duration-300 text-center"
              >
                Shop Now
              </Link>
              <Link 
                href="/about" 
                className="border-2 border-white hover:bg-white/10 text-white px-6 py-3 sm:px-8 sm:py-3 
                          rounded-full text-base sm:text-lg font-semibold transition-all duration-300 text-center"
              >
                About Agiigo
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}