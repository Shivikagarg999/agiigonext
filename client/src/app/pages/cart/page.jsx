"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCart() {
      try {
        const userId = Cookies.get("user") ? JSON.parse(Cookies.get("user"))._id : null;
        if (!userId) {
          router.push("/login");
          return;
        }

        const res = await fetch(`http://localhost:4000/api/cart/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();
        setCart(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  const removeFromCart = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/cart/remove/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to remove item");

      setCart(cart.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await fetch(`http://localhost:4000/api/cart/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update quantity");

      setCart(cart.map((item) => (item._id === id ? { ...item, quantity } : item)));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currency = cart.length > 0 ? cart[0].priceCurrency : "USD";

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (cart.length === 0) return <p className="text-center text-gray-500">Your cart is empty.</p>;
  useEffect(() => {
    let userData = Cookies.get("user") || localStorage.getItem("user");

    if (!userData) {
      router.push("/login"); // Redirect to login if no user
    } else {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        router.push("/login");
      }
    }
  }, []);

  if (!user) return <p className="text-center text-gray-500">Redirecting to login...</p>;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>

        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item._id} className="flex items-center justify-between border-b pb-4">
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img src={item.image || "/default-product.jpg"} alt={item.name} className="w-16 h-16 rounded-lg" />
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">{item.price} {item.priceCurrency}</p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4">
                <button className="px-3 py-1 bg-gray-200" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                  -
                </button>
                <span className="px-4">{item.quantity}</span>
                <button className="px-3 py-1 bg-gray-200" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                  +
                </button>
              </div>

              {/* Remove Button */}
              <button onClick={() => removeFromCart(item._id)} className="text-red-600 hover:text-red-800">
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Total & Checkout */}
        <div className="mt-8 text-right">
          <h2 className="text-2xl font-bold">Total: {totalAmount} {currency}</h2>
          <button className="bg-[#EB8426] text-white py-3 px-6 rounded-lg mt-4 hover:bg-orange-700">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}