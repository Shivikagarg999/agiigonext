"use client";
import { useState } from "react";
const api_url = process.env.NEXT_PUBLIC_API_URL;
import Cookies from 'universal-cookie'; // Import the cookies library

const cookies = new Cookies(); // Initialize cookies

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    // Get the user from cookies
    const userCookie = cookies.get("user");
  
    console.log("User retrieved from cookies:", userCookie); // Debugging
  
    if (!userCookie) {
      setMessage("No user data provided. Please log in.");
      return;
    }
  
    const user = typeof userCookie === "string" ? JSON.parse(userCookie) : userCookie;
  
    console.log("Parsed user data:", user);
  
    if (!user._id) {
      setMessage("Invalid user data. Please log in again.");
      return;
    }
  
    // Add seller ID to form data
    const productData = { ...formData, userId: user._id, price: Number(formData.price) };
  
    try {
      console.log("Sending request with productData:", productData);
  
      const response = await fetch("https://api.agiigo.com/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
  
      console.log("Response received:", response);
  
      const data = await response.json();
  
      console.log("Response data:", data);
  
      if (response.ok) {
        setMessage("Product added successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          image: "",
        });
      } else {
        setMessage(data.error || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Error adding product.");
    }
  };   

  return (
    <>
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg border-2 border-orange-400 mb-8 mt-8">
      <h2 className="text-3xl font-semibold text-center text-orange-600 mb-6">Add a New Product</h2>
      
      {message && (
        <p
          className={`text-center ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Product Description
          </label>
          <textarea
            name="description"
            placeholder="Enter product description"
            value={formData.description}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            rows="4"
          ></textarea>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            placeholder="Enter product price"
            value={formData.price}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            name="category"
            placeholder="Enter product category"
            value={formData.category}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="text"
            name="image"
            placeholder="Enter image URL"
            value={formData.image}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-orange-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
