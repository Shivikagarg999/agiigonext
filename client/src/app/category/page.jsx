"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BrowseByCategory() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const res = await fetch("https://api.agiigo.com/api/products");
        const data = await res.json();
        const uniqueCategories = [...new Set(data.map(p => p.category))]
          .slice(0, 14);
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
    <div className="w-full bg-white py-6 pl-4">
      <h2 className="text-2xl font-bold mb-5 text-black text-center">Browse Categories</h2>
      
      <div className="w-full overflow-x-auto no-scrollbar pr-4"> 
        <div className="flex gap-3 w-max">
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
            // Actual categories
            categories.map((name) => (
              <Link
                key={name}
                href={`/shop?category=${encodeURIComponent(name)}`}
                className="flex items-center justify-center rounded-full border-2 border-gray-300 px-6 py-4 text-base font-semibold text-black hover:bg-gray-100 hover:border-gray-400 transition-all whitespace-nowrap min-w-[120px]"
              >
                {name}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}