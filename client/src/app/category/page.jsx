"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const generateLightColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 80%, 90%)`;
};

export default function BrowseByCategory() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth"
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const res = await fetch("https://api.agiigo.com/api/products");
        const data = await res.json();
        const uniqueCategories = [...new Set(data.map(p => p.category))]
          .slice(0, 14)
          .map(category => ({
            name: category,
            color: generateLightColor()
          }));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-white py-8 relative">
      <h2 className="text-2xl font-bold mb-6 text-black text-center">Browse Categories</h2>
      
      <div className="relative group">
        {/* Left scroll button (visible on hover) */}
        <button 
          onClick={scrollLeft}
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
        </button>

        {/* Categories container */}
        <div 
          ref={scrollContainerRef}
          className="w-full overflow-x-auto no-scrollbar px-4"
        > 
          <div className="flex gap-4 w-max pb-2">
            {isLoading ? (
              // Skeleton loader
              [...Array(8)].map((_, index) => (
                <div 
                  key={index}
                  className="rounded-full border-2 border-gray-200 px-6 py-4 min-w-[120px] animate-pulse"
                >
                  <div className="h-5 bg-gray-200 rounded-full w-full"></div>
                </div>
              ))
            ) : (
              // Actual categories with random colors
              categories.map(({name, color}) => (
                <Link
                  key={name}
                  href={`/shop?category=${encodeURIComponent(name)}`}
                  className="flex items-center justify-center rounded-full px-6 py-4 text-base font-semibold text-black hover:opacity-90 transition-all whitespace-nowrap min-w-[120px]"
                  style={{ backgroundColor: color }}
                >
                  {name}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right scroll button (visible on hover) */}
        <button 
          onClick={scrollRight}
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Hide scrollbar globally for this component */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}