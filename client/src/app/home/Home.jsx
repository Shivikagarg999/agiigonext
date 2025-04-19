"use client";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <header 
        className="relative bg-[url('/images/topimg.jpeg')] bg-cover bg-center bg-no-repeat 
                   text-white min-h-[70vh] md:min-h-[80vh] w-full flex items-center"
      >
        {/* Enhanced overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/10">
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="max-w-2xl px-6 py-12 md:px-10 md:py-16 lg:py-20 rounded-lg">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 tracking-tight">
              Style <span className="text-[#FF6B00]">Redefined</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed max-w-lg">
              Discover premium fashion that blends quality with contemporary design. 
              Shop the latest trends at unbeatable prices with fast delivery.
            </p>
            
            {/* Enhanced search bar with Temu-like styling */}
            <div className="mb-10 relative w-full max-w-2xl">
              <div className="relative flex items-center shadow-xl rounded-full bg-white overflow-hidden">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more..." 
                  className="px-6 py-4 w-full rounded-full focus:outline-none 
                            focus:ring-1 focus:ring-[#FF6B00] text-gray-800 placeholder-gray-400 text-base"
                />
                <button 
                  className="absolute right-2 bg-[#FF6B00] hover:bg-[#E55C00] 
                            p-2.5 rounded-full transition-colors duration-200"
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            {/* CTA Buttons with enhanced styling */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <Link 
                href="/shop" 
                className="bg-[#FF6B00] hover:bg-[#E55C00] text-white px-8 py-3.5 rounded-full 
                          text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 
                          text-center transform hover:scale-105 active:scale-95"
              >
                Shop Now
              </Link>
              <Link 
                href="/about" 
                className="border-2 border-white hover:bg-white/20 text-white px-8 py-3.5 
                          rounded-full text-lg font-semibold transition-all duration-200 text-center
                          transform hover:scale-105 active:scale-95"
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