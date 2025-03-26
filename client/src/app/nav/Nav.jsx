"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, User, Search, ShoppingCart, Heart, Menu, X } from "lucide-react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);
  let hoverTimer;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://api.agiigo.com/api/products");
        const data = await res.json();
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories.slice(0, 8)); // Limit to 8 categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    return () => {
      clearTimeout(hoverTimer);
    };
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(hoverTimer);
    setIsCategoriesOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimer = setTimeout(() => {
      setIsCategoriesOpen(false);
    }, 300); // 300ms delay before closing
  };

  const goToCart = () => {
    router.push("/cart");
  };

  const handleCategoryClick = (category) => {
    router.push(`/shop?category=${encodeURIComponent(category)}`);
    setIsCategoriesOpen(false);
  };

  return (
    <nav className="bg-white py-5 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-[#EB8426]">
          <img src="/images/logo.jpg" className="h-8" alt="Logo" />
        </a>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center space-x-8 text-lg font-semibold">
          <li><a href="/" className="text-gray-700 hover:text-black">Home</a></li>
          
          {/* Shop Link */}
          <li><a href="/shop" className="text-gray-700 hover:text-black">Shop</a></li>
          
          {/* Categories Dropdown - Hover Activated with Delay */}
          <li 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={dropdownRef}
          >
            <div className="flex items-center space-x-1 cursor-pointer">
              <span className="text-gray-700 hover:text-black">Categories</span>
              <ChevronDown className={`h-5 w-5 text-gray-700 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {isCategoriesOpen && (
              <div 
                className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg z-50 border border-gray-100"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="grid grid-cols-1 gap-1 p-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className="px-4 py-3 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </li>
          
          <li><a href="/about" className="text-gray-700 hover:text-black">About</a></li>
          <li><a href="#" className="text-gray-700 hover:text-black">Contact</a></li>
        </ul>

        {/* Right Section (Icons & Login) */}
        <div className="hidden lg:flex items-center space-x-4">
          <User className="h-6 w-6 text-[#EB8426]" />
          <a href="/login" className="text-[#EB8426] font-semibold">Login / Register</a>
          <Search className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer" />
          <ShoppingCart 
            className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer" 
            onClick={goToCart}
          />
          <Heart className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer" />
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden focus:outline-none">
          {isOpen ? <X className="h-8 w-8 text-gray-700" /> : <Menu className="h-8 w-8 text-gray-700" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md py-4 px-6">
          <ul className="flex flex-col space-y-4 text-lg font-semibold">
            <li><a href="/" className="text-gray-700 hover:text-black">Home</a></li>
            <li><a href="/shop" className="text-gray-700 hover:text-black">Shop</a></li>
            
            {/* Mobile Categories - Click Activated */}
            <li className="border-b pb-2">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer text-gray-700 hover:text-black">
                  Categories
                  <ChevronDown className="h-5 w-5 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-2 pl-4 space-y-2">
                  {categories.map((category) => (
                    <a
                      key={category}
                      href={`/shop?category=${encodeURIComponent(category)}`}
                      className="block py-2 text-gray-600 hover:text-orange-600"
                    >
                      {category}
                    </a>
                  ))}
                </div>
              </details>
            </li>
            
            <li><a href="/about" className="text-gray-700 hover:text-black">About</a></li>
            <li><a href="#" className="text-gray-700 hover:text-black">Contact</a></li>
            <li>
              <div className="flex items-center space-x-4">
                <User className="h-6 w-6 text-[#EB8426]" />
                <a href="/login" className="text-[#EB8426] font-semibold">Login / Register</a>
              </div>
            </li>
            <li className="flex space-x-4">
              <Search className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer" />
              <ShoppingCart
                className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer"
                onClick={goToCart}
              />
              <Heart className="h-6 w-6 text-[#EB8426] hover:text-black cursor-pointer" />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}