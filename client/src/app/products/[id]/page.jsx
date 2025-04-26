"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Nav from "@/app/nav/Nav";
import Footer from "@/app/footer/Footer";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { FaCheckCircle, FaShoppingCart, FaUser, FaStore, FaPhone, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import BrowseByCategory from "../../category/page";
import DOMPurify from 'dompurify';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [loadingSeller, setLoadingSeller] = useState(false);
  const [seller, setSeller] = useState(null);
  
  // Review states
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`https://api.agiigo.com/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product details");

        const data = await res.json();
        setProduct(data);
        
        if (data.user && !data.isGuestProduct) {
          fetchSellerDetails(data.user);
        }
        
        fetchProductReviews(data._id);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const userData = Cookies.get("user") || localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const fetchProductReviews = async (productId) => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`https://api.agiigo.com/api/reviews/${productId}/reviews`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      
      const data = await res.json();
      setReviews(data.reviews);
      setAverageRating(data.averageRating || 0);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      toast.error("Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchSellerDetails = async (sellerId) => {
    setLoadingSeller(true);
    try {
      const id = sellerId._id || sellerId.id || sellerId;
      const res = await fetch(`https://api.agiigo.com/api/seller/${id}`);
      if (!res.ok) throw new Error("Failed to fetch seller details");
      
      const data = await res.json();
      setSeller(data.seller || data);
    } catch (err) {
      console.error("Error fetching seller:", err);
    } finally {
      setLoadingSeller(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.info("Please log in to submit a review");
      router.push("/login");
      return;
    }
    
    if (!newReview.comment.trim()) {
      toast.error("Please write your review comment");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`https://api.agiigo.com/api/reviews/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment,
          userId: user._id
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review");

      toast.success("Review submitted successfully!");
      fetchProductReviews(id);
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const renderRatingStars = (rating) => {
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
    
    return stars;
  };

  const addToCart = async () => {
    if (!user) {
      toast.info("Please log in to add items to your cart");
      router.push("/login");
      return;
    }

    setIsAddingToCart(true);
    try {
      const res = await fetch("https://api.agiigo.com/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          productId: product._id, 
          quantity,
          userId: user._id 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add to cart");

      toast.success(
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-500 text-lg" />
          <span>"{product.name}" added to cart!</span>
        </div>
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const buyNow = () => {
    addToCart().then(() => {
      router.push("/checkout");
    });
  };

  const sanitizeHTML = (html) => {
    if (typeof window !== 'undefined') {
      return DOMPurify.sanitize(html);
    }
    return html;
  };

  if (loading) return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <Nav />
      <BrowseByCategory />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-md aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="h-8 bg-gray-200 rounded-full w-3/4 animate-pulse mb-4"></div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="h-8 bg-gray-200 rounded-full w-1/4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-1/4 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-full w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-full w-2/3 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <div className="h-5 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <div className="w-10 h-10 bg-gray-200 animate-pulse"></div>
                  <div className="w-12 h-10 bg-gray-100 animate-pulse"></div>
                  <div className="w-10 h-10 bg-gray-200 animate-pulse"></div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full sm:w-40"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full sm:w-40"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="bg-white text-black min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => router.push("/products")}
          className="mt-4 bg-[#EB8426] text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition"
        >
          Browse Products
        </button>
      </div>
      <Footer />
    </div>
  );

  if (!product) return (
    <div className="bg-white text-black min-h-screen">
      <Nav />
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Product not found</p>
        <button 
          onClick={() => router.push("/products")}
          className="mt-4 bg-[#EB8426] text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition"
        >
          Browse Products
        </button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <Nav />
      <ToastContainer />
      <BrowseByCategory/>
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-md">
                <img
                  src={product.image || "/default-product.jpg"}
                  alt={product.name}
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.src = "/default-product.jpg";
                  }}
                />
                {product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-2xl text-gray-700 font-semibold">
                    {product.price} {product.priceCurrency}
                  </p>
                  {product.originalPrice && (
                    <p className="text-lg text-gray-500 line-through">
                      {product.originalPrice} {product.priceCurrency}
                    </p>
                  )}
                </div>
              </div>

              <div 
                className="prose max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(product.description) }} 
              />

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <span className="font-semibold text-gray-800">Quantity:</span>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-6 py-2 bg-white text-gray-900 font-medium">
                    {quantity}
                  </span>
                  <button
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  className={`flex items-center justify-center gap-2 bg-[#EB8426] text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition w-full sm:w-auto ${
                    isAddingToCart ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  onClick={addToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    "Adding..."
                  ) : (
                    <>
                      <FaShoppingCart />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
                <button
                  className="border border-[#EB8426] text-[#EB8426] py-3 px-6 rounded-lg hover:bg-[#EB8426] hover:text-white transition w-full sm:w-auto"
                  onClick={buyNow}
                >
                  Buy Now
                </button>
              </div>
              
              {product?.user && !product.isGuestProduct && (
                <div className="mt-16 border-t pt-10">
                  <h2 className="text-2xl font-bold mb-6">Seller Information</h2>
                  
                  {loadingSeller ? (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded-full w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded-full w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ) : seller ? (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {seller.pfp ? (
                              <img 
                                src={seller.pfp} 
                                alt={seller.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaUser className="text-3xl text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <FaStore className="text-[#EB8426]" />
                            <button 
                              onClick={() => router.push(`/seller/profpublic/${seller._id}`)}
                              className="hover:underline hover:text-[#EB8426] transition"
                            >
                              {seller.name}
                            </button>
                          </h3>
                          <p className="text-gray-600 mt-1">{seller.role === 'seller' ? 'Verified Seller' : 'Individual Seller'}</p>
                          
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {seller.contact && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <FaPhone className="text-[#EB8426]" />
                                <span>{seller.contact}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Seller information not available</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="mt-16 border-t pt-10">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
              <div>
                <div className="flex">
                  {renderRatingStars(averageRating)}
                </div>
                <p className="text-gray-600 mt-1">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-10">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Your Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className="text-2xl focus:outline-none"
                      >
                        {star <= newReview.rating ? (
                          <FaStar className="text-yellow-400" />
                        ) : (
                          <FaRegStar className="text-yellow-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="review" className="block text-gray-700 mb-2">Your Review</label>
                  <textarea
                    id="review"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB8426]"
                    placeholder="Share your experience with this product..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className={`bg-[#EB8426] text-white py-2 px-6 rounded-md hover:bg-orange-700 transition ${
                    isSubmittingReview ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmittingReview}
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
            
            {reviewsLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b pb-6 animate-pulse">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b pb-6">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {review.user?.pfp ? (
                          <img 
                            src={review.user.pfp} 
                            alt={review.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUser className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{review.user?.name || 'Anonymous'}</h4>
                        <div className="flex items-center gap-1">
                          {renderRatingStars(review.rating)}
                          <span className="text-gray-500 text-sm ml-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-6">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}