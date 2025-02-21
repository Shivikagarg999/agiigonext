"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Nav from "../nav/Nav";
import Footer from "../footer/Footer";
import TopBar from "../components/TopBar";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("https://api.agiigo.com/api/products", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);

        const uniqueCategories = [...new Set(data.map((product) => product.category))];
        setCategories(uniqueCategories);

        const highestPrice = Math.max(...data.map((product) => product.price));
        setMaxPrice(highestPrice);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    filtered = filtered.filter((product) => product.price >= minPrice && product.price <= maxPrice);
    
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, minPrice, maxPrice, searchQuery, products]);

  return (
    <>
      <TopBar/>
      <Nav />
      <div className="container mx-auto px-6 py-10">
        <div className="relative w-full h-auto max-h-[96vh] flex items-center justify-center overflow-hidden rounded-lg">
          <img src="/images/prod.jpeg" alt="Shop Banner" className="w-full h-auto object-cover" />
        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <h3 className="font-semibold mb-2">Category</h3>
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md ${!selectedCategory ? "bg-[#EB8426] text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Products
                </button>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md ${selectedCategory === category ? "bg-[#EB8426] text-white" : "hover:bg-gray-100"}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold mt-6 mb-2">Price Range</h3>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">$</span>
              <input
                type="number"
                className="w-20 border rounded px-2 py-1"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
              />
              <span>-</span>
              <span className="text-gray-600">$</span>
              <input
                type="number"
                className="w-20 border rounded px-2 py-1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex justify-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="border rounded-lg px-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#EB8426]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <p className="text-center text-gray-500">Loading products...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-center text-gray-500">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <a 
                    key={product.id || product._id} 
                    href={`/products/${product.id || product._id}`} 
                    className="border rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
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
                    >
                      Add to Cart
                    </button>
                  </a>
                ))}
              </div>          
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}