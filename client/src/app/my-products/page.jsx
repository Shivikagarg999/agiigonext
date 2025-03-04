"use client";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import Footer from "../footer/Footer";
import Nav from "../nav/SellerNav";

const sellerImage =
  "https://i.pinimg.com/236x/bd/42/8e/bd428e6bb156d90045700dbf3e967c3e.jpg";

const cookies = new Cookies();

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const userCookie = cookies.get("user");

      if (!userCookie || !userCookie._id) {
        setMessage("No user data found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://api.agiigo.com/api/seller-products/${userCookie._id}`
        );
        const data = await res.json();

        if (res.ok) {
          setProducts(data);
        } else {
          setMessage(data.error || "Failed to load products.");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setMessage("Error fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Nav />
      <div className="w-full p-6 bg-white shadow rounded-lg mt-8 max-w-6xl mx-auto">
        {/* Seller Profile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden">
              <img
                src={sellerImage || "/default-avatar.jpg"}
                alt="Seller Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">Agiigo Seller Hub</h2>
              <p className="text-gray-500 text-sm">
                Sell Smarter. Grow Faster!
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center mb-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition">
            My Products
          </button>
          <select className="border px-3 py-2 rounded-md">
            <option>All time</option>
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : message ? (
          <p className="text-center text-red-600">{message}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className={`border p-4 rounded-lg shadow-md relative cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selected.includes(product._id) ? "border-blue-500" : ""
                }`}
                onClick={() => toggleSelect(product._id)}
              >
                {/* Selection Badge */}
                {selected.includes(product._id) && (
                  <div className="absolute top-2 left-2 w-5 h-5 bg-blue-500 rounded-full border-white border-2"></div>
                )}

                {/* Product Image */}
                <img
                  src={product.image || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-64 bg-gray-200 rounded-md object-cover"
                />

                {/* Product Name & Price */}
                <div className="flex justify-between items-center mt-4">
                  <h3 className="text-lg font-semibold truncate">
                    {product.name}
                  </h3>
                  <p className="text-black bg-blue-100 px-3 py-1 rounded-md font-semibold">
                    ${product.price}
                  </p>
                </div>

                {/* Rating */}
                <p className="text-gray-500 text-sm mt-1">⭐ 4.8 (87)</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}