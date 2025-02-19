'use client';

import { useState, useEffect } from "react";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        if (!token) {
          setMessage("You need to be logged in to see your products.");
          return;
        }
  
        const response = await fetch('http://localhost:4000/api/products/seller', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        if (response.ok) {
          setProducts(data.products);
        } else {
          setMessage(data.message || "No products found.");
        }
      } catch (error) {
        setMessage("Error fetching products.");
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, []);  

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg border-2 border-orange-400 mb-8 mt-8">
      <h2 className="text-3xl font-semibold text-center text-orange-600 mb-6">Your Products</h2>

      {message && (
        <p
          className={`text-center ${typeof message === "string" && message.includes("No products") ? "text-red-600" : "text-green-600"}`}
        >
          {typeof message === "object" ? JSON.stringify(message) : message}
        </p>
      )}

      {products.length > 0 ? (
        <div>
          {products.map((product) => (
            <div key={product._id} className="border-b-2 pb-4 mb-4">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p>{product.description}</p>
              <p className="text-orange-600">Price: ${product.price}</p>
              <p>Category: {product.category}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-red-600">No products found.</p>
      )}
    </div>
  );
}
