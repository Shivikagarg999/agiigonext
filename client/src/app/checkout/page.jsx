"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/app/nav/Nav";
import Footer from "@/app/footer/Footer";
import { FaChevronRight, FaLock } from "react-icons/fa";
import Link from "next/link";

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    state: '',
    zipCode: '',
    paymentMethod: 'credit-card',
    saveInfo: false
  });
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
            const parsedUser = JSON.parse(decodeURIComponent(cookieUser));
            setUser(parsedUser);
            setFormData(prev => ({
              ...prev,
              firstName: parsedUser.firstName || '',
              lastName: parsedUser.lastName || '',
              email: parsedUser.email || ''
            }));
            fetchCartData(parsedUser._id, cookieToken);
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
        setFormData(prev => ({
          ...prev,
          firstName: parsedUser.firstName || '',
          lastName: parsedUser.lastName || '',
          email: parsedUser.email || ''
        }));
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || 
                 document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    
    if (!token || !user?._id || !cart) {
      router.push("/login");
      return;
    }

    try {
      const orderData = {
        userId: user._id,
        cartId: cart._id,
        items: cart.items,
        totalAmount: cart.totalPrice,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode
        },
        contactInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod
      };

      const res = await fetch("https://api.agiigo.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to place order");
      
      const order = await res.json();
      router.push(`/order-confirmation?orderId=${order._id}`);
    } catch (err) {
      console.error("Error placing order:", err);
      setError(err.message);
    }
  };

  const hasCartItems = () => {
    return cart?.items && Array.isArray(cart.items) && cart.items.length > 0;
  };

  if (loading) return <CheckoutSkeleton />;

  if (error) return (
    <div className="bg-white text-black min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-20 text-center max-w-3xl">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button 
            onClick={() => router.push("/cart")}
            className="mt-4 bg-[#EB8426] text-white py-3 px-8 rounded-md hover:bg-orange-700 transition font-medium text-lg w-full max-w-xs"
          >
            Back to Cart
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Please add items to your cart before checkout</p>
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
          <Link href="/cart" className="hover:text-[#EB8426]">Cart</Link>
          <FaChevronRight className="mx-2 text-xs" />
          <span className="text-[#EB8426]">Checkout</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#EB8426] focus:border-[#EB8426]"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#EB8426] focus:border-[#EB8426]"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#EB8426] focus:border-[#EB8426]"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#EB8426] focus:border-[#EB8426]"
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Shipping Address</h2>
              
              <div className="mb-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#EB8426] focus:border-[#EB8426]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#EB8426] focus:border-[#EB8426]"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#EB8426] focus:border-[#EB8426]"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#EB8426] focus:border-[#EB8426]"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#EB8426] focus:border-[#EB8426]"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="saveInfo"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#EB8426] focus:ring-[#EB8426] border-gray-300 rounded"
                />
                <label htmlFor="saveInfo" className="ml-2 block text-sm text-gray-700">
                  Save this information for next time
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Payment Method</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="credit-card"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === 'credit-card'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#EB8426] focus:ring-[#EB8426] border-gray-300"
                  />
                  <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                    Credit Card
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#EB8426] focus:ring-[#EB8426] border-gray-300"
                  />
                  <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                    PayPal
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="bank-transfer"
                    name="paymentMethod"
                    value="bank-transfer"
                    checked={formData.paymentMethod === 'bank-transfer'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#EB8426] focus:ring-[#EB8426] border-gray-300"
                  />
                  <label htmlFor="bank-transfer" className="ml-3 block text-sm font-medium text-gray-700">
                    Bank Transfer
                  </label>
                </div>
              </div>
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
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 pt-4 border-t border-gray-100">
                  <span>Total</span>
                  <span>{cart.totalPrice} {cart.items[0]?.productId?.priceCurrency || 'USD'}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#EB8426] hover:bg-orange-700 text-white py-3 rounded-md transition font-medium text-lg mb-4 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FaLock /> Complete Order
              </button>

              <div className="text-center text-xs text-gray-500">
                <p>By placing your order, you agree to our <Link href="/terms" className="text-[#EB8426] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#EB8426] hover:underline">Privacy Policy</Link>.</p>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

// Skeleton Loader Component for Checkout
function CheckoutSkeleton() {
  return (
    <div className="bg-white text-black min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm text-gray-300 mb-6">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <FaChevronRight className="mx-2 text-xs text-gray-200" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <FaChevronRight className="mx-2 text-xs text-gray-200" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              {[...Array(2)].map((_, i) => (
                <div key={i} className="mb-6">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}

              <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-6 mt-8"></div>
              
              <div className="mb-6">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              <div className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse ml-2"></div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
              
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse ml-3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
              
              <div className="space-y-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                ))}
              </div>

              <div className="h-12 bg-gray-200 rounded animate-pulse mb-4"></div>

              <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}