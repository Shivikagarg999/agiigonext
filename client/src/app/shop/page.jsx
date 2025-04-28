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
  const [currency, setCurrency] = useState(null);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const searchParams = useSearchParams();
  const categoryFromQuery = searchParams.get("category");

  const generateRandomRating = () => {
    const base = 4;
    const variation = Math.random() * 1.5;
    return Math.min(5, (base + variation).toFixed(1));
  };

  const generateRandomDiscount = () => Math.floor(Math.random() * 50) + 10;

  const formatPrice = (price, currencyCode) => {
    if (!currencyCode) {
      return price.toFixed(2);
    }
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

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

        const highestPrice = data.length > 0 ? Math.max(...data.map(p => p.price)) : 1000;
        setMaxPrice(highestPrice);
        setPriceRange(highestPrice);
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

    if (currency) {
      filtered = filtered.filter(product => product.priceCurrency === currency);
    }

    const currencyProducts = currency ? 
      products.filter(p => p.priceCurrency === currency) : 
      products;
    const highestPrice = currencyProducts.length > 0 ? 
      Math.max(...currencyProducts.map(p => p.price)) : 
      1000;
    setMaxPrice(highestPrice);
    
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    filtered = filtered.filter((product) => product.price <= priceRange);
    
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
    
    const currencyProducts = newCurrency ? 
      products.filter(p => p.priceCurrency === newCurrency) : 
      products;
    const highestPrice = currencyProducts.length > 0 ? 
      Math.max(...currencyProducts.map(p => p.price)) : 
      1000;
    setPriceRange(highestPrice);
  };

  return (
    <div className="bg-white">
      <TopBar />
      <Nav />
      <div className="container mt-8 bg-white text-black px-4 sm:px-6 py-8 sm:py-10">
        <div className="relative w-full h-auto max-h-[96vh] flex items-center justify-center overflow-hidden rounded-xl shadow-md">
          <img 
            src="/images/prod.jpeg" 
            alt="Shop Banner" 
            className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105" 
          />
        </div>
        
        <BrowseByCategory/>
        
        <div className="mt-8 flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-1/4 bg-white shadow-lg rounded-xl p-5 h-fit sticky top-4">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                >
                  <span className="text-gray-700">{currency || "All Currencies"}</span>
                  {showCurrencyDropdown ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </button>
                
                {showCurrencyDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden transition-all duration-200 origin-top">
                    <button 
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center transition-colors ${
                        !currency 
                          ? 'bg-orange-50 text-orange-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => handleCurrencyChange(null)}
                    >
                      <span>All Currencies</span>
                      {!currency && (
                        <svg className="ml-2 h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    
                    <button 
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center transition-colors ${
                        currency === 'USD' 
                          ? 'bg-orange-50 text-orange-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => handleCurrencyChange('USD')}
                    >
                      <span>USD - US Dollar</span>
                      {currency === 'USD' && (
                        <svg className="ml-2 h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    
                    <button 
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center transition-colors ${
                        currency === 'AED' 
                          ? 'bg-orange-50 text-orange-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => handleCurrencyChange('AED')}
                    >
                      <span>AED - UAE Dirham</span>
                      {currency === 'AED' && (
                        <svg className="ml-2 h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button 
              className="w-full flex items-center justify-between bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg mb-4 hover:bg-gray-100 transition-colors border border-gray-200"
              onClick={() => setShowCategories(!showCategories)}
            >
              <span className="font-medium">Categories</span>
              {showCategories ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showCategories && (
              <ul className="space-y-2 mb-6 animate-fadeIn">
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                      !selectedCategory
                        ? "bg-orange-50 text-[#EB8426] font-semibold border border-orange-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                        selectedCategory === category
                          ? "bg-orange-50 text-[#EB8426] font-semibold border border-orange-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3">Price Range {currency && `(${currency})`}</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#EB8426]"
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{currency ? formatPrice(0, currency) : "0.00"}</span>
                  <div className="bg-gray-50 px-3 py-1 rounded-md font-medium border border-gray-200">
                    Up to {currency ? formatPrice(priceRange, currency) : priceRange.toFixed(2)}
                  </div>
                  <span className="text-gray-600">{currency ? formatPrice(maxPrice, currency) : maxPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex justify-center">
              <div className="relative w-full max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="border rounded-lg px-10 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-[#EB8426] focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                {error}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 text-gray-700 p-6 rounded-xl text-center">
                <p className="text-lg font-medium">No products found {currency && `for ${currency} currency`}</p>
                <p className="mt-2 text-sm">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <a 
                    key={product.id || product._id} 
                    href={`/products/${product.id || product._id}`} 
                    className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-orange-100 group"
                  >
                    <div className="aspect-square w-full bg-gray-50 relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {product.discount > 30 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-sm font-bold text-red-600">
                          {formatPrice(product.price, product.priceCurrency)}
                        </p>
                        {product.originalPrice && (
                          <p className="text-xs text-gray-500 line-through">
                            {formatPrice(product.originalPrice, product.priceCurrency)}
                          </p>
                        )}
                      </div>
                      
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight min-h-[40px] group-hover:text-[#EB8426] transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="mt-2 flex items-center">
                        <StarRating rating={product.rating} />
                        <span className="ml-1 text-xs text-gray-500">
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
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}