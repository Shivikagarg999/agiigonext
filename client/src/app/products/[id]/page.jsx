"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; 
import Nav from "@/app/nav/Nav";
import Footer from "@/app/footer/Footer";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`https://api.agiigo.com/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product details");

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  const addToCart = () => console.log("Added to cart:", product);
  const buyNow = () => console.log("Buying now:", product);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return <p className="text-center text-gray-500">Product not found.</p>;

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="w-full flex justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-sm h-auto object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-4"> {/* ✅ Reduced extra spacing */}
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600 text-lg">${product.price}</p>

            {/* Description */}
            <p className="text-gray-700">{product.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-semibold">Quantity:</span>
              <button
                className="px-3 py-1 border rounded-l bg-gray-200 hover:bg-gray-300"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="px-4 py-1 border-t border-b">{quantity}</span>
              <button
                className="px-3 py-1 border rounded-r bg-gray-200 hover:bg-gray-300"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="bg-[#EB8426] text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition w-full sm:w-auto"
                onClick={addToCart}
              >
                Add to Cart
              </button>
              <button
                className="border border-[#EB8426] text-[#EB8426] py-3 px-6 rounded-lg hover:bg-[#EB8426] hover:text-white transition w-full sm:w-auto"
                onClick={buyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
