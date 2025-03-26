"use client";
import { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt, FaShoppingCart } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);

  // Generate random ratings (4-5 stars with some variation)
  const generateRandomRating = () => {
    const base = 4;
    const variation = Math.random() * 1.5;
    return Math.min(5, (base + variation).toFixed(1));
  };

  const addToCart = async (product, e) => {
    e.preventDefault();
    console.log("Added to cart:", product.name);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://api.agiigo.com/api/products");
        const data = await res.json();
        const productsWithRatings = data.map(product => ({
          ...product,
          rating: generateRandomRating(),
          reviewCount: Math.floor(Math.random() * 100) + 10
        }));
        setProducts(productsWithRatings);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Star rating component
  const StarRating = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Discover Our Products
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Premium quality for your everyday needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <a
              key={product.id || product._id}
              href={`/products/${product.id || product._id}`}
              className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              {/* Product image with hover effect */}
              <div className="aspect-w-3 aspect-h-4 w-full h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product info - Reorganized layout */}
              <div className="p-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Price moved below title */}
                  <div className="mt-1">
                    <p className="text-lg font-bold text-orange-600">
                      {product.price} {product.priceCurrency}
                    </p>
                    {product.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        {product.originalPrice} {product.priceCurrency}
                      </p>
                    )}
                  </div>
                  
                  {/* Rating below price */}
                  <div className="mt-2 flex items-center">
                    <StarRating rating={product.rating} />
                    <span className="ml-2 text-sm text-gray-500">
                      ({product.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={(e) => addToCart(product, e)}
                  className="mt-4 w-full flex items-center justify-center rounded-md bg-orange-600 py-2 px-4 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
              </div>

              {/* Optional badge */}
              {Math.random() > 0.7 && (
                <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {Math.random() > 0.5 ? "Popular" : "New"}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;