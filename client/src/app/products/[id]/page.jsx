"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Nav from "@/app/nav/Nav";
import Footer from "@/app/footer/Footer";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`https://api.agiigo.com/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product details");

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    const userData = Cookies.get("user") || localStorage.getItem("user");

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const addToCart = async () => {
    if (!user) {
      toast.info("Please log in to add items to your cart");
      router.push("/login");
      return;
    }

    setIsAddingToCart(true);
    try {
      const res = await fetch("https://api.agiigo.com/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          productId: product._id, 
          quantity,
          userId: user._id 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add to cart");

      // Success notification with checkmark icon
      toast.success(
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-500 text-lg" />
          <span>"{product.name}" added to cart!</span>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const buyNow = () => {
    addToCart().then(() => {
      router.push("/checkout");
    });
  };

  if (loading) return (
    <div className="bg-white text-black min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Loading product details...</p>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="bg-white text-black min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => router.push("/products")}
          className="mt-4 bg-[#EB8426] text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition"
        >
          Browse Products
        </button>
      </div>
      <Footer />
    </div>
  );

  if (!product) return (
    <div className="bg-white text-black min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Product not found</p>
        <button 
          onClick={() => router.push("/products")}
          className="mt-4 bg-[#EB8426] text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition"
        >
          Browse Products
        </button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <Nav />
      <ToastContainer />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Product Image */}
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-md">
                <img
                  src={product.image || "/default-product.jpg"}
                  alt={product.name}
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.src = "/default-product.jpg";
                  }}
                />
                {product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-2xl text-gray-700 font-semibold">
                    {product.price} {product.priceCurrency}
                  </p>
                  {product.originalPrice && (
                    <p className="text-lg text-gray-500 line-through">
                      {product.originalPrice} {product.priceCurrency}
                    </p>
                  )}
                </div>
              </div>

              <div className="prose max-w-none text-gray-600">
                {product.description}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <span className="font-semibold text-gray-800">Quantity:</span>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-6 py-2 bg-white text-gray-900 font-medium">
                    {quantity}
                  </span>
                  <button
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  className={`flex items-center justify-center gap-2 bg-[#EB8426] text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition w-full sm:w-auto ${
                    isAddingToCart ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  onClick={addToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    "Adding..."
                  ) : (
                    <>
                      <FaShoppingCart />
                      <span>Add to Cart</span>
                    </>
                  )}
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
      </main>
      <Footer />
    </div>
  );
}