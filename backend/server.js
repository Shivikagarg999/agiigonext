const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/User");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Product = require("./models/Product");
require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
const csvParser = require("csv-parser");
const cookieParser = require("cookie-parser");
const crypto = require("crypto")
const jwt = require("jsonwebtoken");
const ImageKit = require("imagekit");
const Cart = require("./models/Cart")

// Middleware
app.use(express.json());
app.use(cookieParser());
JWT_SECRET='5d9a573fea33f72342dc47bec8951b4bcba0ae61283ce0ee6cfa26659e0b5837'

// ✅ CORS Setup
const allowedOrigins = ["https://agiigo.com","https://www.agiigo.com","http://localhost:3000", "https://sellerhub.agiigo.com"];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true, 
};
app.use(cors(corsOptions));

// ✅ Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  const authMiddleware = (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;  // This should include userId
      next();
    } catch (error) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
  };  

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
  
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
  
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
        // Generate JWT Token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
        // Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
  
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  app.post("/api/logout", (req, res) => {
    res.clearCookie("token", { path: "/" }); // Clear JWT token
    res.clearCookie("user", { path: "/" });  // Clear user info if stored in cookies
  
    res.status(200).json({ message: "Logged out successfully" });
  });    
// ✅ Register Route
app.post("/api/register", async (req, res) => {
  const { name, email, password, contact, role } = req.body;
  
  if (!name || !email || !password || !contact || !role) {
      return res.status(400).json({ message: "All fields are required" });
  }

  if (!["buyer", "seller"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
  }

  try {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: "User already exists" });

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create User
      const newUser = new User({
          name,
          email,
          password: hashedPassword,
          contact,
          role,
      });

      await newUser.save();

      // Generate JWT Token
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

      // Set token in HTTP-only Cookie
      res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
      });

      res.status(201).json({
          message: "User registered successfully",
          user: {
              _id: newUser._id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
          },
          token,
      });
  } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
});
// ✅ Product Routes
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
// ✅ Trending Products Route
app.get("/api/trending-products", async (req, res) => {
  try {
    const trendingProducts = await Product.find({ isTrending: true });
    res.json(trendingProducts);
  } catch (error) {
    console.error("Error fetching trending products:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
// ✅ New Arrivals Route
app.get("/api/new-arrivals", async (req, res) => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const newArrivals = await Product.find({ createdAt: { $gte: oneDayAgo } }).sort({ createdAt: -1 });
    res.json(newArrivals);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
// ✅ Fetch Single Product
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("user", "name email pfp");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Seller Upload Products Route

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, priceCurrency ,category, userId } = req.body;

    if (!name || !description || !price || !priceCurrency ||!category || !userId || !req.file) {
      return res.status(400).json({ error: "All fields are required, including an image" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Upload image to ImageKit
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer.toString("base64"), // Convert buffer to base64
      fileName: req.file.originalname,
      folder: "/products",
    });

    // Create the new product
    const newProduct = new Product({
      name,
      description,
      price,
      priceCurrency,
      category,
      image: uploadedImage.url, // Store ImageKit URL
      user: userId,
    });

    // Save product to the database
    await newProduct.save();

    // Update the user document with the new product reference
    await User.findByIdAndUpdate(userId, { $push: { products: newProduct._id } });

    res.status(201).json({ message: "Product uploaded successfully", product: newProduct });
  } catch (err) {
    console.error("Error uploading product:", err);
    res.status(500).json({ error: "Failed to upload product", details: err.message });
  }
});
app.get("/api/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("User Fetch Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
//seller products
app.get("/api/seller-products/:sellerId", async (req, res) => {
  try {
      const { sellerId } = req.params;
      const seller = await User.findById(sellerId).populate("products"); 

      if (!seller || !seller.products.length) {
          return res.status(404).json({ message: "No products uploaded yet" });
      }

      res.status(200).json(seller.products);
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});
// ✅ Get Seller Profile
app.get("/api/profile/seller/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;
    const seller = await User.findById(sellerId).select("-password");

    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json(seller);
  } catch (error) {
    console.error("Error fetching seller profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// UPDATE SELLER PROFILE
app.put("/api/profile/seller/:sellerId", upload.single("pfp"), async (req, res) => {
    try {
        const { sellerId } = req.params;
        const { name, contact, address, state, city, country, pincode } = req.body;

        let updateData = { name, contact, address, state, city, country, pincode };

        // Upload Image to ImageKit if file exists
        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `seller_${sellerId}.jpg`,
                folder: "/sellers",
            });
            updateData.pfp = uploadResponse.url; // Save the uploaded image URL
        }

        const updatedSeller = await User.findByIdAndUpdate(
            sellerId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedSeller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        res.status(200).json(updatedSeller);
    } catch (error) {
        console.error("Error updating seller profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update-edit product
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, priceCurrency, category } = req.body;

    if (!name || !description || !price || !priceCurrency || !category ) {
      return res.status(400).json({ error: "All fields except image are required" });
    }

    // Find the product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let updatedFields = { name, description, price, priceCurrency, category };

    // If a new image is uploaded, update it on ImageKit
    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer.toString("base64"),
        fileName: req.file.originalname,
        folder: "/products",
      });
      updatedFields.image = uploadedImage.url;
    }

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product", details: err.message });
  }
});
// DELETE PRODUCT
app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product", details: err.message });
  }
});

//CART ROUTES
app.post("/api/cart/add", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    console.log("Adding to Cart:", { userId, productId, quantity });

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing userId or productId" });
    }

    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Check if product already exists
      let itemIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    } else {
      // Create new cart
      cart = new Cart({
        userId,
        products: [{ productId, quantity }],
      });
    }

    await cart.save();
    console.log("Cart updated successfully", cart);
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get Cart Route
app.get("/api/cart", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate("items.productId");
    if (!cart) return res.status(404).json({ message: "Cart is empty" });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});