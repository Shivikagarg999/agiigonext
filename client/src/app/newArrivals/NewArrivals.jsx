"use client";
import { useEffect, useState } from "react";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch(`${api_url}/api/new-arrivals`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-bold text-black mb-6">New Arrivals</h1>
      
      {/* Horizontal Scrolling Wrapper */}
      <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex gap-6">
          {products.map((product) => (
            <a
              key={product._id}
              href={`/product/${product._id}`}
              className="border p-4 rounded-lg shadow-lg bg-white min-w-[250px] h-[420px] flex flex-col justify-between block"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[320px] object-contain rounded-md"
              />
              <h2 className="text-lg font-semibold text-black mt-2">{product.name}</h2>
              <p className="text-gray-700 text-xl font-bold">₹{product.price}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;