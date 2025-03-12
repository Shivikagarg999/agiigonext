"use client";
import { useEffect, useState } from "react";
const api_url = process.env.NEXT_PUBLIC_API_URL;

const Products = () => {
  const [products, setProducts] = useState([]);

  const addToCart = async () => {
    console.log("Added to cart");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://api.agiigo.com/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-bold text-black mb-6">
        Explore Our Products
      </h1>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex flex-wrap gap-6 justify-center">
          {products.map((product) => (
            <a
            key={product.id || product._id}
            href={`/products/${product.id || product._id}`}
            className="rounded-lg p-4 hover:shadow-lg transition cursor-pointer 
                       flex flex-col justify-between w-[250px] h-[360px]" // Fixed size
          >
            <div className="w-full h-[200px] flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="flex flex-col flex-grow justify-between">
              <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
              <p className="text-gray-600">{product.price}</p>
              <button
                className="bg-[#EB8426] text-white py-2 px-4 rounded hover:bg-orange-700 transition mt-4 w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
              >
                Add to Cart
              </button>
            </div>
          </a>          
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
