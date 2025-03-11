"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Nav from "@/app/nav/Nav";
import Footer from "@/app/footer/Footer";
import Link from "next/link";

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
        console.log("Fetched product:", data);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  const addToCart = async (productId, quantity) => {
    try {
      const res = await fetch("https://api.agiigo.com/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await res.json();
      console.log("Cart updated:", data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const buyNow = () => console.log("Buying now:", product);

  if (loading)
    return <p className="text-center text-gray-500">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">{error}</p>;
  if (!product)
    return <p className="text-center text-gray-500">Product not found.</p>;

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="w-full flex justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-xl text-gray-700 font-semibold">
              ${product.price}
            </p>

            <p className="text-gray-600">{product.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-800">Quantity:</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  −
                </button>
                <span className="px-6 py-2 bg-white text-gray-900 font-medium">
                  {quantity}
                </span>
                <button
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

           
{/* Seller Details */}
{product.user && (
  <div className="p-4 border rounded-lg flex items-center gap-4">
    {product.user.pfp && (
      <img
        src={product.user.pfp}
        alt={product.user.name}
        className="w-20 h-20 rounded-full object-cover"
      />
    )}
    <div>
      <h3 className="text-lg font-semibold text-gray-800">Seller</h3>
      <Link href={`/seller/${product.user._id}`} className="text-blue-600 hover:underline">
        {product.user.name}
      </Link>
    </div>
  </div>
)}


            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="bg-[#EB8426] text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition w-full sm:w-auto"
                onClick={() => addToCart(product._id, quantity)}
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