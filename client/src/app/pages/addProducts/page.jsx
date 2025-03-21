"use client";
import { useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "", // This will store the ImageKit URL after upload
  });

  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null); // Store the selected file

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Store the selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    const userCookie = cookies.get("user");
    if (!userCookie) {
      setMessage("No user data provided. Please log in.");
      return;
    }
  
    const user = typeof userCookie === "string" ? JSON.parse(userCookie) : userCookie;
    if (!user._id) {
      setMessage("Invalid user data. Please log in again.");
      return;
    }
  
    // Use FormData to send the file
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("description", formData.description);
    formDataObj.append("price", formData.price);
    formDataObj.append("category", formData.category);
    formDataObj.append("userId", user._id);
    formDataObj.append("image", formData.image); // Make sure this is a File object
  
    try {
      const response = await fetch("https://api.agiigo.com/api/products", {
        method: "POST",
        body: formDataObj,
      });
  
      const data = await response.json();
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
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg border-2 border-orange-400 mb-8 mt-8">
      <h2 className="text-3xl font-semibold text-center text-orange-600 mb-6">Add a New Product</h2>

      {message && (
        <p className={`text-center ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Product Description</label>
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
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
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
  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    className="mt-2 w-full p-3 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
    required
  >
    <option value="" disabled>Select a category</option>
    <option value="electronics">Electronics</option>
    <option value="fashion">Fashion</option>
    <option value="home-appliances">Home Appliances</option>
    <option value="books">Books</option>
    <option value="beauty">Beauty</option>
    <option value="sports">Sports</option>
    <option value="toys">Toys & Games</option>
    <option value="groceries">Groceries</option>
    <option value="automobiles">Automobiles</option>
    <option value="furniture">Furniture</option>
    <option value="healthcare">Healthcare</option>
    <option value="pet-supplies">Pet Supplies</option>
    <option value="stationery">Stationery</option>
    <option value="jewelry">Jewelry</option>
    <option value="mobile-accessories">Mobile Accessories</option>
    <option value="laptops">Laptops & Computers</option>
    <option value="smartphones">Smartphones</option>
    <option value="kitchen-appliances">Kitchen Appliances</option>
    <option value="home-decor">Home Decor</option>
    <option value="baby-products">Baby Products</option>
    <option value="gaming">Gaming & Consoles</option>
    <option value="music">Music & Instruments</option>
    <option value="movies">Movies & Entertainment</option>
    <option value="outdoor">Outdoor & Camping</option>
    <option value="footwear">Footwear</option>
    <option value="watches">Watches</option>
    <option value="handbags">Handbags & Accessories</option>
    <option value="tools">Tools & Hardware</option>
    <option value="office-supplies">Office Supplies</option>
    <option value="pharmacy">Pharmacy & Wellness</option>
    <option value="art-supplies">Art Supplies</option>
    <option value="collectibles">Collectibles & Antiques</option>
    <option value="luxury">Luxury Items</option>
    <option value="subscription-boxes">Subscription Boxes</option>
    <option value="other">Other</option>
  </select>
</div>

        <div>
  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
    Upload Image
  </label>
  <input
    type="file"
    name="image"
    accept="image/*"
    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
    className="mt-2 w-full p-3 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
    required
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
  );
}