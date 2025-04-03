"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";

export default function Nav() {
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryHover = (open) => {
    if (window.innerWidth < 1024) return;
    if (open) {
      setIsCategoriesOpen(true);
    } else {
      setTimeout(() => {
        if (!dropdownRef.current?.matches(':hover')) {
          setIsCategoriesOpen(false);
        }
      }, 200);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setIsProfileDropdownOpen(false);
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left side - logo and menu button */}
          <div className="flex items-center">
            <button 
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <div className="flex-shrink-0 ml-2 lg:ml-0">
              <Link href="/">
                <img src="/images/logo.jpg" alt="Logo" className="h-6" />
              </Link>
            </div>
          </div>

          {/* Center - navigation links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="font-medium text-gray-800 hover:text-orange-500 transition-colors">Home</Link>
            <div className="relative" ref={dropdownRef}>
              <button 
                className="flex items-center font-medium text-gray-800 hover:text-orange-500 transition-colors"
                onMouseEnter={() => handleCategoryHover(true)}
                onMouseLeave={() => handleCategoryHover(false)}
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                aria-expanded={isCategoriesOpen}
              >
                Categories
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoriesOpen && (
                <div 
                  className="absolute left-0 mt-2 w-full min-w-[300px] max-w-md bg-white shadow-xl rounded-md border border-gray-200 overflow-hidden"
                  onMouseEnter={() => handleCategoryHover(true)}
                  onMouseLeave={() => handleCategoryHover(false)}
                >
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setIsCategoriesOpen(false);
                          router.push(`/shop?category=${encodeURIComponent(category)}`);
                        }}
                        className="block p-3 rounded-md font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors text-left"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/shop" className="font-medium text-gray-800 hover:text-orange-500 transition-colors">Shop</Link>
            <Link href="/about" className="font-medium text-gray-800 hover:text-orange-500 transition-colors">About</Link>
            <a href="https://sellerhub.agiigo.com/login" className="font-medium text-gray-800 hover:text-orange-500 transition-colors">Sell with us</a>
          </div>

          {/* Right side - user and cart */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {isLoggedIn ? (
              <div className="relative" ref={profileDropdownRef}>
                <button 
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-1 focus:outline-none"
                  aria-label="User profile"
                  aria-expanded={isProfileDropdownOpen}
                >
                  {user?.pfp ? (
                    <img 
                      src={user.pfp} 
                      alt="Profile" 
                      className="h-10 w-10 rounded-full object-cover border-2 border-orange-100"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-orange-500" />
                    </div>
                  )}
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center"
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="hidden sm:flex items-center space-x-1 text-[#EB8426] font-semibold text-sm sm:text-base"
              >
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-orange-500" />
                </div>
                <span>Login</span>
              </Link>
            )}
            
            <div className="relative">
              <button 
                onClick={() => router.push('/cart')}
                className="flex items-center"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-orange-500 cursor-pointer transition-colors" />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center space-x-2 py-2 sm:hidden">
              {isLoggedIn ? (
                <>
                  {user?.pfp ? (
                    <img 
                      src={user.pfp} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover border-2 border-orange-100"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-orange-500" />
                    </div>
                  )}
                  <div className="flex flex-col ml-2">
                    <Link 
                      href="/profile" 
                      className="text-[#EB8426] font-semibold hover:underline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {user?.name || "Account"}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="text-left text-sm text-gray-600 hover:text-orange-500 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-orange-500" />
                  </div>
                  <span className="text-[#EB8426] font-semibold">
                    Login / Register
                  </span>
                </Link>
              )}
            </div>
            
            <Link 
              href="/categories" 
              className="block py-2 font-medium text-gray-800 hover:text-orange-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            
            <div className="pt-2 space-y-3 border-t mt-2">
              <Link 
                href="/" 
                className="block py-2 font-medium text-gray-800 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/shop" 
                className="block py-2 font-medium text-gray-800 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                href="/about" 
                className="block py-2 font-medium text-gray-800 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <a 
                href="https://sellerhub.agiigo.com/login" 
                className="block py-2 font-medium text-gray-800 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sell with us
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}