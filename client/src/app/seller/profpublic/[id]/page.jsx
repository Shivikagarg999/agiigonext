"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Nav from "@/app/nav/Nav";
import Footer from "@/app/footer/Footer";
import { FaStore, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { Search } from "lucide-react";

export default function SellerProfile() {
  const { id } = useParams();
  const [sellerData, setSellerData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://api.agiigo.com/api/seller/${id}`);
        {console.log(products)}
        if (!response.ok) {
          throw new Error(response.status === 404 ? "Seller not found" : "Failed to fetch data");
        }

        const data = await response.json();
        
        setSellerData(data.seller);
        
        const transformedProducts = data.products.items.map(product => ({
          ...product,
          rating: generateRandomRating(),
          reviewCount: Math.floor(Math.random() * 100) + 10,
          discount: generateRandomDiscount(),
          originalPrice: calculateOriginalPrice(product.price)
        }));
        
        setProducts(transformedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSellerData();
  }, [id]);

  const generateRandomRating = () => (4 + Math.random()).toFixed(1);
  const generateRandomDiscount = () => Math.floor(Math.random() * 30) + 10;
  const calculateOriginalPrice = (price) => 
    parseFloat((price * (1 + (Math.random() * 0.3 + 0.1))).toFixed(2));

  const StarRating = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-xs" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto px-4 py-10 flex-1">
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg p-6 animate-pulse h-96"></div>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto px-4 py-20 text-center flex-1">
        <p className="text-red-500">{error}</p>
      </div>
      <Footer />
    </div>
  );

  if (!sellerData) return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto px-4 py-20 text-center flex-1">
        <p className="text-gray-500">Seller not found</p>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <Nav />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Seller Profile Section - Responsive layout */}
          <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {sellerData.pfp ? (
                    <img 
                      src={sellerData.pfp} 
                      alt={sellerData.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <FaUser className="text-2xl sm:text-3xl text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">{sellerData.name}</h1>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded self-center sm:self-auto">
                    {sellerData.role === 'seller' ? 'Verified Seller' : 'Individual'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                  {sellerData.contact && (
                    <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                      <FaPhone className="text-orange-500 flex-shrink-0" />
                      <span className="truncate">{sellerData.contact}</span>
                    </div>
                  )}
                  
                  {sellerData.email && (
                    <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                      <FaEnvelope className="text-orange-500 flex-shrink-0" />
                      <span className="truncate">{sellerData.email}</span>
                    </div>
                  )}
                  
                  {(sellerData.address || sellerData.city || sellerData.state) && (
                    <div className="flex items-start gap-2 text-gray-700 text-sm sm:text-base col-span-2">
                      <FaMapMarkerAlt className="text-orange-500 mt-1 flex-shrink-0" />
                      <span className="truncate">
                        {[sellerData.address, sellerData.city, sellerData.state, sellerData.country]
                          .filter(Boolean)
                          .join(', ')}
                        {sellerData.pincode && ` - ${sellerData.pincode}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section - Responsive layout */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 sm:mb-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search seller's products..."
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <FaStore className="text-orange-500" />
              Products by {sellerData.name}
            </h2>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <div 
                    key={product._id} 
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <a href={`/products/${product._id}`} className="block">
                      <div className="aspect-square bg-gray-100 relative">
                        <img
                          src={product.image || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-contain p-2 sm:p-4"
                          loading="lazy"
                        />
                        {product.discount > 20 && (
                          <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-red-600 text-white text-xs font-bold px-1 sm:px-2 py-0.5 sm:py-1 rounded">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>

                      <div className="p-2 sm:p-3">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm sm:text-base h-12 sm:h-14">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center gap-1 sm:gap-2 mb-1">
                          <span className="text-red-600 font-bold text-sm sm:text-base">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: product.priceCurrency || 'USD'
                            }).format(product.price)}
                          </span>
                          <span className="text-gray-500 text-xs sm:text-sm line-through">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: product.priceCurrency || 'USD'
                            }).format(product.originalPrice)}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <StarRating rating={product.rating} />
                          <span className="ml-1 text-gray-500 text-xs">
                            ({product.reviewCount})
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-10">
                <p className="text-gray-500 text-sm sm:text-base">
                  {searchQuery 
                    ? "No products match your search" 
                    : "This seller hasn't listed any products yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}