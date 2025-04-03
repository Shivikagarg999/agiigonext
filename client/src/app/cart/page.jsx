"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/app/nav/Nav";
import Footer from "@/app/footer/Footer";
import { FaTrash, FaShoppingCart, FaChevronRight } from "react-icons/fa";
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
      const res = await fetch(`https://api.agiigo.com/api/cart?userId=${userId}`, {
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
      const res = await fetch("https://api.agiigo.com/api/cart/remove", {
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
      <div className="container mx-auto px-4 py-20 text-center max-w-3xl">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button 
            onClick={() => router.push("/products")}
            className="mt-4 bg-[#EB8426] text-white py-3 px-8 rounded-md hover:bg-orange-700 transition font-medium text-lg w-full max-w-xs"
          >
            Continue Shopping
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (!cart || !hasCartItems()) return (
    <div className="bg-white text-black min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShoppingCart className="text-4xl text-[#EB8426]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
          <Link 
            href="/products"
            className="bg-[#EB8426] text-white py-3 px-8 rounded-md hover:bg-orange-700 transition font-medium text-lg inline-block"
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
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#EB8426]">Home</Link>
          <FaChevronRight className="mx-2 text-xs" />
          <span className="text-[#EB8426]">Shopping Cart</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart ({cart.items.length})</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 bg-gray-50 p-4 font-medium text-gray-600 text-sm uppercase tracking-wide">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Action</div>
              </div>
              
              {/* Cart Items */}
              {hasCartItems() && cart.items.map((item) => (
                <div key={item._id} className="grid grid-cols-12 p-4 border-t border-gray-100 items-center hover:bg-gray-50 transition">
                  <div className="col-span-6 flex items-center gap-4">
                    <img 
                      src={item.productId?.image || '/images/placeholder-product.jpg'} 
                      alt={item.productId?.name || 'Product image'}
                      className="w-20 h-20 object-contain rounded border border-gray-200"
                      onError={(e) => e.target.src = '/images/placeholder-product.jpg'}
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{item.productId?.name || 'Unnamed Product'}</h3>
                      <p className="text-sm text-gray-500">
                        SKU: {item.productId?.sku || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 text-center font-medium text-gray-700">
                    {item.priceAtTimeOfAddition} {item.productId?.priceCurrency || 'USD'}
                  </div>
                  <div className="col-span-2 text-center text-gray-600">
                    {item.quantity}
                  </div>
                  <div className="col-span-2 text-center">
                    <button 
                      onClick={() => removeItem(item.productId?._id)}
                      className="text-gray-400 hover:text-red-500 transition p-2"
                      disabled={!item.productId?._id}
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span className="font-medium">{cart.totalPrice} {cart.items[0]?.productId?.priceCurrency || 'USD'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-600 pt-4 border-t border-gray-100">
                  <span>Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 pt-4 border-t border-gray-100">
                  <span>Estimated Total</span>
                  <span>{cart.totalPrice} {cart.items[0]?.productId?.priceCurrency || 'USD'}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-[#EB8426] hover:bg-orange-700 text-white py-3 rounded-md transition font-medium text-lg mb-4 shadow-md hover:shadow-lg"
                disabled={!hasCartItems()}
              >
                Proceed to Checkout
              </button>

              <div className="text-center text-sm text-gray-500">
                <p>or</p>
                <Link 
                  href="/shop"
                  className="text-[#EB8426] hover:underline font-medium inline-block mt-2"
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm text-gray-300 mb-6">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <FaChevronRight className="mx-2 text-xs text-gray-200" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="hidden md:grid grid-cols-12 bg-gray-50 p-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="col-span-3 h-5 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              
              {[...Array(3)].map((_, i) => (
                <div key={i} className="grid grid-cols-12 p-4 border-t border-gray-100 items-center gap-4">
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-5 bg-gray-200 rounded animate-pulse mx-auto w-16"></div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-5 bg-gray-200 rounded animate-pulse mx-auto w-8"></div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
              
              <div className="space-y-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                ))}
              </div>

              <div className="h-12 bg-gray-200 rounded animate-pulse mb-4"></div>

              <div className="flex justify-center items-center gap-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}