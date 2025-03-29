"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import Nav from "../nav/Nav";
import Footer from "../footer/Footer";
import TopBar from "../components/TopBar";
import BrowseByCategory from "../category/page";

function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const searchParams = useSearchParams();
  const categoryFromQuery = searchParams.get("category");

  const generateRandomRating = () => {
    const base = 4;
    const variation = Math.random() * 1.5;
    return Math.min(5, (base + variation).toFixed(1));
  };

  const generateRandomDiscount = () => Math.floor(Math.random() * 50) + 10;

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
        const productsWithRatings = data.map(product => ({
          ...product,
          rating: generateRandomRating(),
          reviewCount: Math.floor(Math.random() * 100) + 10,
          discount: generateRandomDiscount()
        }));
        
        setProducts(productsWithRatings);
        setFilteredProducts(productsWithRatings);

        const uniqueCategories = [...new Set(data.map((product) => product.category))];
        setCategories(uniqueCategories);

        const usdProducts = data.filter(p => p.priceCurrency === "USD");
        const highestUSDPrice = usdProducts.length > 0 ? Math.max(...usdProducts.map(p => p.price)) : 1000;
        setMaxPrice(highestUSDPrice);
        setPriceRange(highestUSDPrice);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryFromQuery);
  }, [categoryFromQuery]);

  useEffect(() => {
    let filtered = products;

    // First filter by currency
    filtered = filtered.filter(product => product.priceCurrency === currency);

    // Then update max price for the selected currency
    const currencyProducts = products.filter(p => p.priceCurrency === currency);
    const highestPrice = currencyProducts.length > 0 ? Math.max(...currencyProducts.map(p => p.price)) : 1000;
    setMaxPrice(highestPrice);
    
    // Then filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Then filter by price range
    filtered = filtered.filter((product) => product.price <= priceRange);
    
    // Finally filter by search query
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, priceRange, searchQuery, products, currency]);

  const StarRating = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-[10px]" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-[10px]" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-[10px]" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    setShowCurrencyDropdown(false);
    
    // Reset price range to max for the new currency
    const currencyProducts = products.filter(p => p.priceCurrency === newCurrency);
    const highestPrice = currencyProducts.length > 0 ? Math.max(...currencyProducts.map(p => p.price)) : 1000;
    setPriceRange(highestPrice);
  };

  return (
    <div className="bg-white">
      <TopBar />
      <Nav />
      <div className="container mt-8 bg-white text-black px-6 py-10">
        <div className="relative w-full h-auto max-h-[96vh] flex items-center justify-center overflow-hidden rounded-lg">
          <img src="/images/prod.jpeg" alt="Shop Banner" className="w-full h-auto object-cover" />
        </div>
      <BrowseByCategory/>
        <div className="mt-10 flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4 bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-3 py-1 border rounded-md text-sm"
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                >
                  {currency}
                  {showCurrencyDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showCurrencyDropdown && (
                  <div className="absolute right-0 mt-1 w-20 bg-white border rounded-md shadow-lg z-10">
                    <button 
                      className={`w-full text-left px-3 py-2 text-sm ${currency === 'USD' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                      onClick={() => handleCurrencyChange('USD')}
                    >
                      USD
                    </button>
                    <button 
                      className={`w-full text-left px-3 py-2 text-sm ${currency === 'AED' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                      onClick={() => handleCurrencyChange('AED')}
                    >
                      AED
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button 
              className="w-full flex items-center justify-between bg-gray-100 text-gray-700 py-2 px-4 rounded-md mb-4 hover:bg-gray-200 transition"
              onClick={() => setShowCategories(!showCategories)}
            >
              <span className="font-medium">Categories</span>
              {showCategories ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showCategories && (
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md border transition ${
                      !selectedCategory
                        ? "border-[#EB8426] text-[#EB8426] font-semibold"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-md border transition ${
                        selectedCategory === category
                          ? "border-[#EB8426] text-[#EB8426] font-semibold"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="font-semibold mt-6 mb-2">Price Range ({currency})</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#EB8426]"
              />
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{new Intl.NumberFormat(undefined, {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(0)}</span>
                <div className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium">
                  Up to {new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(priceRange)}
                </div>
                <span className="text-gray-600">{new Intl.NumberFormat(undefined, {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(maxPrice)}</span>
              </div>
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
              <p className="text-center text-gray-500">No products found for {currency} currency.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-2">
                {filteredProducts.map((product) => (
                  <a 
                    key={product.id || product._id} 
                    href={`/products/${product.id || product._id}`} 
                    className="bg-white rounded-sm overflow-hidden hover:shadow-sm transition-all"
                  >
                    <div className="aspect-square w-full bg-gray-100 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.discount > 30 && (
                        <div className="absolute top-1 left-1 bg-red-600 text-white text-[12px] font-bold px-1 rounded">
                          SALE
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <div className="flex items-center gap-1">
                        <p className="text-md font-bold text-red-600">
                          {new Intl.NumberFormat(undefined, {
                            style: 'currency',
                            currency: product.priceCurrency,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(product.price)}
                        </p>
                        {product.originalPrice && (
                          <p className="text-[14px] text-gray-500 line-through">
                            {new Intl.NumberFormat(undefined, {
                              style: 'currency',
                              currency: product.priceCurrency,
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }).format(product.originalPrice)}
                          </p>
                        )}
                        <span className="text-[13px] text-red-600">
                          -{product.discount}%
                        </span>
                      </div>
                      
                      <h3 className="text-[15px] font-bold text-gray-900 mt-[2px] line-clamp-2 leading-tight h-[32px]">
                        {product.name}
                      </h3>
                      
                      <div className="mt-[2px] flex items-center">
                        <StarRating rating={product.rating} />
                        <span className="ml-1 text-[13px] text-gray-500">
                          ({product.reviewCount})
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ProductsContent />
    </Suspense>
  );
}