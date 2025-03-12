"use client";
import { useEffect, useState } from "react";

const TrendingProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const res = await fetch("https://api.agiigo.com/api/trending-products");
        const data = await res.json();
        setTrendingProducts(data);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-bold text-black mb-6">Trending Products</h1>

      {/* Horizontal Scrolling Wrapper */}
      <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex gap-6">
          {trendingProducts.map((product) => (
            <a
              key={product._id}
              href={`/product/${product._id}`}
              className="p-4 rounded-lg bg-white w-[250px] h-[320px] flex flex-col justify-between block"
            >
              {/* Image Wrapper for Consistent Size */}
              <div className="w-full h-[200px] flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-between flex-grow">
                <h2 className="text-lg font-semibold text-black mt-2">
                  {product.name}
                </h2>
                <p className="text-gray-700 text-xl font-bold">₹{product.price}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingProducts;
