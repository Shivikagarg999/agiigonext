"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { name: "Electronics", image: "/images/elec.jpg", link: "/electronics" },
  { name: "Fashion", image: "/images/fash.jpg", link: "/fashion" },
  { name: "Groceries", image: "/images/groc.jpg", link: "/groceries" },
  { name: "Home Appliance", image: "/images/homea.jpg", link: "/home-appliance" },
  { name: "Furniture", image: "/images/furn.jpg", link: "/furniture" },
  { name: "Beauty", image: "/images/beau.jpg", link: "/beauty" },
  { name: "Books", image: "/images/books.jpg", link: "/books" },
];

const BrowseByCategory = () => {
  const scrollAmount = 250;

  const handleScroll = (direction) => {
    const container = document.getElementById("category-slider");
    container.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
  };

  return (
    <div className="p-8 bg-white overflow-hidden">
      <h1 className="text-3xl font-bold text-black mb-6">Browse by Category</h1>
      <div className="relative">
        {/* Left Scroll Button - Hidden on Desktop */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 md:hidden"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Category Slider */}
        <div
          id="category-slider"
          className="overflow-x-auto snap-x snap-mandatory scrollbar-hide flex gap-6 px-10 scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch", overflowX: "hidden" }} // Ensures smooth scrolling
        >
          {categories.map((category, index) => (
            <a
              key={index}
              href={category.link}
              className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 min-w-[160px] border"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-32 h-32 object-cover rounded-md"
              />
              <p className="text-black font-medium mt-2">{category.name}</p>
            </a>
          ))}
        </div>

        {/* Right Scroll Button - Hidden on Desktop */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 md:hidden"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default BrowseByCategory;