"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/app/nav/Nav";
import Footer from "@/app/footer/Footer";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        const cookieUser = document.cookie.split('; ').find(row => row.startsWith('user='))?.split('=')[1];
        
        if (cookieToken && cookieUser) {
          try {
            setUser(JSON.parse(decodeURIComponent(cookieUser)));
            fetchCartData(JSON.parse(decodeURIComponent(cookieUser))._id, cookieToken);
            return;
          } catch (e) {
            console.error("Error parsing cookie user data:", e);
          }
        }
        router.push("/login");
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchCartData(parsedUser._id, token);
      } catch (error) {
        console.error("Error parsing user data:", error);
        clearAuthData();
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  const fetchCartData = async (userId, token) => {
    try {
      const res = await fetch(`http://localhost:4000/api/cart?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch cart");
      }
      
      const data = await res.json();
      if (!data?.items) throw new Error("Invalid cart data structure");
      
      setCart(data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      
      if (err.message.includes("401") || err.message.includes("403")) {
        clearAuthData();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    const token = localStorage.getItem("token") || 
                 document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    
    if (!token || !user?._id) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user._id,
          productId
        }),
      });

      if (!res.ok) throw new Error("Failed to remove item");
      const updatedCart = await res.json();
      setCart(updatedCart);
    } catch (err) {
      console.error("Error removing item:", err);
      setError(err.message);
    }
  };

  const hasCartItems = () => {
    return cart?.items && Array.isArray(cart.items) && cart.items.length > 0;
  };

  if (loading) return <CartSkeleton />;

  if (error) return (
    <div className="bg-white text-black min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => router.push("/products")}
          className="mt-4 bg-[#EB8426] text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition"
        >
          Continue Shopping
        </button>
      </div>
      <Footer />
    </div>
  );

  if (!cart || !hasCartItems()) return (
    <div className="bg-white text-black min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <FaShoppingCart className="mx-auto text-5xl text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet</p>
          <Link 
            href="/products"
            className="bg-[#EB8426] text-white py-3 px-8 rounded-lg hover:bg-orange-700 transition inline-block"
          >
            Shop Now
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="bg-white text-black min-h-screen">
      <Nav />
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-100 p-4 font-semibold">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Action</div>
              </div>
              
              {hasCartItems() && cart.items.map((item) => (
                <div key={item._id} className="grid grid-cols-12 p-4 border-t items-center">
                  <div className="col-span-6 flex items-center gap-4">
                    <img 
                      src={item.productId?.image || '/images/placeholder-product.jpg'} 
                      alt={item.productId?.name || 'Product image'}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => e.target.src = '/images/placeholder-product.jpg'}
                    />
                    <div>
                      <h3 className="font-medium">{item.productId?.name || 'Unnamed Product'}</h3>
                      <p className="text-sm text-gray-500">
                        SKU: {item.productId?.sku || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    {item.priceAtTimeOfAddition} {item.productId?.priceCurrency || 'USD'}
                  </div>
                  <div className="col-span-2 text-center">
                    {item.quantity}
                  </div>
                  <div className="col-span-2 text-center">
                    <button 
                      onClick={() => removeItem(item.productId?._id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={!item.productId?._id}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 bg-gray-50">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{cart.totalPrice} {cart.items[0]?.productId?.priceCurrency || 'USD'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between border-t pt-4 font-bold text-lg">
                  <span>Total</span>
                  <span>{cart.totalPrice} {cart.items[0]?.productId?.priceCurrency || 'USD'}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-[#EB8426] text-white py-3 rounded-lg hover:bg-orange-700 transition"
                disabled={!hasCartItems()}
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 text-sm text-gray-500">
                <p>or</p>
                <Link 
                  href="/products"
                  className="text-[#EB8426] hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Skeleton Loader Component
function CartSkeleton() {
  return (
    <div className="bg-white text-black min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 animate-pulse bg-gray-200 h-10 w-1/3 rounded"></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-100 p-4 font-semibold">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="col-span-3 h-6 bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
              
              {[...Array(3)].map((_, i) => (
                <div key={i} className="grid grid-cols-12 p-4 border-t items-center">
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-200 animate-pulse rounded"></div>
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 animate-pulse w-40 rounded"></div>
                      <div className="h-4 bg-gray-200 animate-pulse w-20 rounded"></div>
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <div className="h-5 bg-gray-200 animate-pulse w-16 rounded"></div>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <div className="h-5 bg-gray-200 animate-pulse w-8 rounded"></div>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <div className="h-5 w-5 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 bg-gray-50">
              <h2 className="text-xl font-bold mb-4 h-7 bg-gray-200 animate-pulse rounded"></h2>
              
              <div className="space-y-4 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-5 bg-gray-200 animate-pulse w-20 rounded"></div>
                    <div className="h-5 bg-gray-200 animate-pulse w-16 rounded"></div>
                  </div>
                ))}
              </div>

              <div className="h-12 bg-gray-200 animate-pulse rounded"></div>

              <div className="mt-4 flex items-center gap-2">
                <div className="h-4 bg-gray-200 animate-pulse w-8 rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse w-32 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}