"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BrowseByCategory() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("https://api.agiigo.com/api/products", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();
        let uniqueCategories = [...new Set(data.map((product) => product.category))];

        // Limit to 6 categories (fits 2 rows max on mobile)
        uniqueCategories = uniqueCategories.sort(() => 0.5 - Math.random()).slice(0, 6);

        // Assign a random product image for each category
        const categoryData = uniqueCategories.map((category) => {
          const productsInCategory = data.filter((product) => product.category === category);
          const randomProduct = productsInCategory[Math.floor(Math.random() * productsInCategory.length)];
          
          return {
            name: category,
            image: randomProduct?.image || "/images/categories/default.jpg",
          };
        });

        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    router.push(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="w-full bg-white py-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-black">What are you shopping for today?</h2>

      {/* Responsive grid for 2-row max on mobile, 1 row on larger screens */}
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-6 px-4 lg:px-16">
        {categories.map(({ name, image }) => (
          <button
            key={name}
            className="flex flex-col items-center space-y-2 hover:scale-105 transition w-[100px] h-[140px] sm:w-[120px] sm:h-[160px] md:w-[140px] md:h-[180px] mx-auto"
            onClick={() => handleCategoryClick(name)}
          >
            <img
              src={image}
              alt={name}
              className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] object-cover rounded-full border shadow-md"
              onError={(e) => (e.target.src = "/images/categories/default.jpg")}
            />
            <span className="text-xs sm:text-sm font-semibold text-center text-black">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
