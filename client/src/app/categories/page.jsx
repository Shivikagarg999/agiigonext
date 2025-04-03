"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Nav from "../nav/Nav";
import Footer from "../footer/Footer";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [categoryPreviews, setCategoryPreviews] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://api.agiigo.com/api/products");
        const data = await res.json();
        
        const categoryMap = {};
        const uniqueCategories = [];
        
        data.forEach(product => {
          if (!categoryMap[product.category]) {
            uniqueCategories.push(product.category);
            categoryMap[product.category] = [];
          }
          if (product.image) {
            categoryMap[product.category].push({
              id: product._id,
              image: product.image,
              name: product.name
            });
          }
        });
        
        setCategories(uniqueCategories);
        
        const previews = {};
        uniqueCategories.forEach(category => {
          const products = categoryMap[category];
          if (products.length > 0) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            previews[category] = {
              name: category,
              image: randomProduct.image,
              productName: randomProduct.name
            };
          }
        });
        
        setCategoryPreviews(previews);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    router.push(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <>
      <Nav/>
      <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => router.back()}
            className="mr-4 p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Shop Categories</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => {
            const preview = categoryPreviews[category];
            
            return (
              <div
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="bg-transparent rounded-lg overflow-hidden 
                           transition-all cursor-pointer active:scale-95 
                           flex flex-col items-center group mb-5"
              >
                {/* Fixed size image container */}
                <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 relative rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-gray-300 transition-colors">
                  {preview?.image ? (
                    <img
                      src={preview.image}
                      alt={`${preview.productName} - ${category}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1899b9e8e9d%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1899b9e8e9d%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2235%22%20y%3D%2255%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </div>
                
                {/* Category name */}
                <div className="mt-3 text-center w-full px-1">
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2">
                    {category}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}