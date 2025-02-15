"use client";
import { useEffect, useState } from "react";

const TrendingProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const res = await fetch(`${api_url}/api/trending-products`);
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
      <div className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide">
        {trendingProducts.map((product) => (
          <a
            key={product._id}
            href={`/product/${product._id}`}
            className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 min-w-[200px] max-w-[250px] border block"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-48 h-48 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold text-black mt-2">
              {product.name}
            </h2>
            <p className="text-black font-medium mt-1">₹{product.price}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;
