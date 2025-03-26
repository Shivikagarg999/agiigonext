"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, ShoppingCart, User, Menu, X } from "lucide-react";

export default function Nav() {
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://api.agiigo.com/api/products");
        const data = await res.json();
        setCategories([...new Set(data.map(p => p.category))]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle window resize for better mobile experience
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Improved hover handling with touch support
  const handleCategoryHover = (open) => {
    if (window.innerWidth < 1024) return; // Disable hover on mobile
    
    clearTimeout(hoverTimer);
    if (open) {
      setIsCategoriesOpen(true);
    } else {
      hoverTimer = setTimeout(() => {
        if (!dropdownRef.current?.matches(':hover')) {
          setIsCategoriesOpen(false);
        }
      }, 200);
    }
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  let hoverTimer;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Navigation Bar */}
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {/* Logo */}
            <div className="flex-shrink-0 ml-2 lg:ml-0">
              <img src="/images/logo.jpg" alt="Logo" className="h-6" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            
          <a href="/" className="font-medium text-gray-800 hover:text-orange-500 transition-colors">Home</a>
            <div 
              className="relative"
              ref={dropdownRef}
            >
              <button 
                className="flex items-center font-medium text-gray-800 hover:text-orange-500 transition-colors"
                onMouseEnter={() => handleCategoryHover(true)}
                onMouseLeave={() => handleCategoryHover(false)}
                onClick={toggleCategories}
                aria-expanded={isCategoriesOpen}
              >
                Categories
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Desktop Dropdown */}
              {isCategoriesOpen && (
                <div 
                  className="absolute left-0 mt-2 w-full min-w-[300px] max-w-md bg-white shadow-xl rounded-md border border-gray-200 overflow-hidden"
                  onMouseEnter={() => handleCategoryHover(true)}
                  onMouseLeave={() => handleCategoryHover(false)}
                >
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {categories.map((category) => (
                      <a
                        key={category}
                        href={`/shop?category=${encodeURIComponent(category)}`}
                        className="block p-3 rounded-md font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        {category}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a href="/shop" className="font-medium text-gray-800 hover:text-orange-500 transition-colors">Shop</a>
            <a href="/about" className="font-medium text-gray-800 hover:text-orange-500 transition-colors">About</a>
           </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="hidden sm:flex items-center space-x-2">
              <User className="h-5 w-5 text-[#EB8426]" />
              <a href="/login" className="text-[#EB8426] font-semibold text-sm sm:text-base">Login / Register</a>
            </div>
            
            <div className="relative">
              <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-orange-500 cursor-pointer transition-colors" />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Login */}
            <div className="flex items-center space-x-2 py-2 sm:hidden">
              <User className="h-5 w-5 text-[#EB8426]" />
              <a href="/login" className="text-[#EB8426] font-semibold">Login / Register</a>
            </div>
            
            <button 
              className="w-full flex items-center justify-between py-2 font-medium text-gray-800"
              onClick={toggleCategories}
              aria-expanded={isCategoriesOpen}
            >
              <span>Categories</span>
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCategoriesOpen && (
              <div className="pl-4 space-y-2">
                {categories.map((category) => (
                  <a
                    key={category}
                    href={`/shop?category=${encodeURIComponent(category)}`}
                    className="block py-2 text-gray-700 hover:text-orange-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category}
                  </a>
                ))}
              </div>
            )}
            
            <div className="pt-2 space-y-3 border-t mt-2">
            <a 
                href="/" 
                className="block py-2 font-medium text-gray-800 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="/shop" 
                className="block py-2 font-medium text-gray-800 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </a>
              <a 
                href="/about" 
                className="block py-2 font-medium text-gray-800 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}