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

// Middleware
app.use(express.json());
app.use(cookieParser());
JWT_SECRET='5d9a573fea33f72342dc47bec8951b4bcba0ae61283ce0ee6cfa26659e0b5837'

mongoose
    .connect("mongodb+srv://shivika:agiigo_karan@cluster0.reo6o.mongodb.net/agiigo-next")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Authentication Middleware
const authMiddleware = (req, res, next) => {
  console.log("Cookies received:", req.cookies);

  const userCookie = req.cookies?.user; // Get the user cookie

  if (!userCookie) {
      return res.status(401).json({ message: "Unauthorized, no token found" });
  }

  try {
      const user = JSON.parse(userCookie); // Parse the JSON string
      console.log("Parsed User:", user);

      req.user = user; // Attach user data to request object
      next();
  } catch (err) {
      console.error("Error parsing user cookie:", err.message);
      return res.status(400).json({ message: "Invalid user cookie" });
  }
};

// ✅ CORS Setup
const allowedOrigins = ["https://agiigo.com","https://www.agiigo.com","http://localhost:3000"];
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
  res.clearCookie("user", { path: "/" });
  res.clearCookie("connect.sid", { path: "/" });
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
    const product = await Product.findById(req.params.id).populate("user", "name email");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
// ✅ Seller Upload Products Route
app.post("/api/products", async (req, res) => {
  try {
    const { name, description, price, category, image, userId } = req.body;

    if (!name || !description || !price || !category || !userId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the new product
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image,
      user: userId, // Ensure this matches your schema field name
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
// ✅ CSV Product Upload Route
const upload = multer({ dest: "uploads/" });

app.post("/api/products/csv", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (row) => {
      const { name, description, price, category, image } = row;
      if (name && description && price && category) {
        results.push({
          name,
          description,
          price: parseFloat(price),
          category,
          image,
          seller: req.user.userId, // Attach seller ID
        });
      }
    })
    .on("end", async () => {
      try {
        const products = await Product.insertMany(results);

        await User.findByIdAndUpdate(req.user.userId, {
          $push: { products: { $each: products.map((p) => p._id) } },
        });

        fs.unlinkSync(req.file.path);

        res.status(201).json({
          message: `${products.length} products added successfully!`,
          products,
        });
      } catch (err) {
        console.error("CSV Upload Error:", err);
        res.status(500).json({ error: "Failed to upload products" });
      }
    });
});
app.get("/api/seller-data", authMiddleware, async (req, res) => {
  try {
    // Fetch seller details only if the user is a seller
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied. Not a seller." });
    }

    const seller = await User.findById(req.user._id).select("-password"); // Fetch user as seller

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json({ user: seller });
  } catch (error) {
    console.error("Error fetching seller data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/profile/seller", authMiddleware, async (req, res) => {
  try {
    // ✅ Ensure req.user._id is used instead of req.user.id
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // ✅ Send user details without password
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.put("/api/profile/seller", authMiddleware, async (req, res) => {
  try {
    console.log("User ID from middleware:", req.user); // Debugging
    
    const userId = req.user._id || req.user.id; // Use _id if id is undefined

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body }, // Ensure safe update
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});