"use client";
import { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import Link from "next/link";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [hasProducts, setHasProducts] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const generateRandomRating = () => {
    const base = 4;
    const variation = Math.random() * 1.5;
    return Math.min(5, (base + variation).toFixed(1));
  };

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("https://api.agiigo.com/api/new-arrivals");
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();
        if (!data?.length) {
          setHasProducts(false);
          return;
        }

        setNewArrivals(data.map(product => ({
          ...product,
          rating: generateRandomRating(),
          reviewCount: Math.floor(Math.random() * 100) + 10,
          discount: Math.floor(Math.random() * 50) + 10
        })));
        
        setHasProducts(true);
      } catch (error) {
        console.error("Fetch error:", error);
        setHasProducts(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

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

  const ProductSkeleton = () => (
    <div className="inline-block bg-white rounded-sm overflow-hidden" style={{ width: "200px" }}>
      <div className="aspect-square w-full bg-gray-200 animate-pulse relative">
        <div className="absolute top-1 left-1 bg-gray-300 text-transparent text-[12px] font-bold px-1 rounded">
          NEW
        </div>
      </div>
      <div className="p-2">
        <div className="flex items-center gap-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
        <div className="h-[32px] mt-[2px]">
          <div className="h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
        </div>
        <div className="mt-[2px] flex items-center">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-2.5 w-2.5 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>
          <div className="ml-1 h-2.5 w-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Early return if no products
  if (!hasProducts && !isLoading) return null;

  return (
    <div className="py-2 px-1 bg-gray-50 min-h-0">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-4">
          <h1 className="text-4xl m-6 font-bold text-gray-900 sm:text-4xl">
            New Arrivals
          </h1>
        </div>

        <div className="relative">
          <div className="overflow-x-auto whitespace-nowrap scrollbar-hide py-2">
            <div className="inline-flex gap-4 px-1">
              {isLoading ? (
                [...Array(6)].map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              ) : (
                newArrivals.map((product) => (
                  <Link 
                    key={product.id || product._id}
                    href={`/products/${product.id || product._id}`}
                    className="inline-block bg-white rounded-sm overflow-hidden hover:shadow-sm transition-all"
                    style={{ width: "200px" }}
                  >
                    <div className="aspect-square w-full bg-gray-100 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-blue-500 text-white text-[12px] font-bold px-1 rounded">
                        NEW
                      </div>
                    </div>

                    <div className="p-2">
                      <div className="flex items-center gap-1">
                        <p className="text-md font-bold text-red-600">
                          {product.price} {product.priceCurrency}
                        </p>
                        {product.originalPrice && (
                          <p className="text-[10px] text-gray-500 line-through">
                            ${product.originalPrice}
                          </p>
                        )}
                        <span className="text-[11px] text-red-600">
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
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;