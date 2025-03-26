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
        uniqueCategories = uniqueCategories.sort(() => 0.5 - Math.random()).slice(0, 6);

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
    <div className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <p className="mt-2 text-lg text-gray-600">Browse our popular collections</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map(({ name, image }) => (
            <div 
              key={name}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden"
              onClick={() => handleCategoryClick(name)}
            >
              <div className="aspect-square w-full flex items-center justify-center p-4">
                <img
                  src={image}
                  alt={name}
                  className="h-[120px] w-[120px] object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => (e.target.src = "/images/categories/default.jpg")}
                />
              </div>
              <div className="p-4 pt-0 text-center">
                <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                  {name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}