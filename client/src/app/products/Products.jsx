"use client";
import { useEffect, useState } from "react";
const api_url = process.env.NEXT_PUBLIC_API_URL;

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(''https://api.agiigo.com/api/products');
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
      <h1 className="text-3xl font-bold text-black mb-6">Explore Our Products</h1>
      <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex gap-6">
          {products.map((product) => (
            <a
              key={product._id}
              href={`/product/${product._id}`}
              className="bg-white shadow-lg rounded-lg p-4 min-w-[250px] h-[420px] flex flex-col justify-between border block"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[320px] object-contain rounded-md"
              />
              <div>
                <h2 className="text-lg font-semibold text-black">{product.name}</h2>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="text-xl font-bold text-black">₹{product.price}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
