"use client";
import { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import Link from "next/link";

const TrendingProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);

  const generateRandomRating = () => {
    const base = 4;
    const variation = Math.random() * 1.5;
    return Math.min(5, (base + variation).toFixed(1));
  };

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const res = await fetch("https://api.agiigo.com/api/trending-products");
        const data = await res.json();
        const productsWithRatings = data.map(product => ({
          ...product,
          rating: generateRandomRating(),
          reviewCount: Math.floor(Math.random() * 100) + 10,
          discount: Math.floor(Math.random() * 50) + 10
        }));
        setTrendingProducts(productsWithRatings);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      }
    };

    fetchTrendingProducts();
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

  return (
    <div className="py-2 px-1 bg-gray-50 min-h-0">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-4">
          <h1 className="text-4xl m-6 font-bold text-gray-900 sm:text-4xl">
            Trending Now
          </h1>
        </div>

        <div className="relative">
          <div className="overflow-x-auto whitespace-nowrap scrollbar-hide py-2">
            <div className="inline-flex gap-4 px-1">
              {trendingProducts.map((product) => (
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
                    <div className="absolute top-1 left-1 bg-red-600 text-white text-[12px] font-bold px-1 rounded">
                      TRENDING
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingProducts;