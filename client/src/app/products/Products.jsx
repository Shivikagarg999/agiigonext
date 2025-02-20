"use client";
import { useEffect, useState } from "react";
const api_url = process.env.NEXT_PUBLIC_API_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const addToCart = async (productId, quantity = 1) => {
    const loggedInUserId = localStorage.getItem("userId"); // Check user session

    if (!loggedInUserId) {
        window.location.href = "/login"; // Redirect to login
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: loggedInUserId, productId, quantity })
        });

        const data = await res.json();
        if (data.success) {
            alert('Added to Cart');
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://api.agiigo.com/api/products');
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
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex flex-wrap gap-6 ">
        {products.map((product) => (
          <a 
            key={product.id || product._id} 
            href={`/products/${product.id || product._id}`} 
            className="border rounded-lg shadow-md p-4 flex-grow basis-[90%] sm:basis-[45%] md:basis-[30%] lg:basis-[22%] xl:basis-[18%] max-w-xs hover:shadow-lg transition cursor-pointer"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
  
            <button
              className="bg-[#EB8426] text-white py-2 px-4 rounded hover:bg-orange-700 transition mt-4 w-full"
              onClick={(e) => {
                e.stopPropagation(); // Prevent link click from firing
                addToCart(product);
              }}
            >
              Add to Cart
            </button>
          </a>
        ))}
      </div>
    </div>
  </div>  
  );
};

export default Products;
