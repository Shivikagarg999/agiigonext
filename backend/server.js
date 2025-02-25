const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/User");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Product = require("./models/Product");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const csvParser = require("csv-parser");
const crypto = require('crypto');

mongoose
    .connect("mongodb+srv://shivika:agiigo_karan@cluster0.reo6o.mongodb.net/agiigo-next")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Allowed origins (includes localhost)
const allowedOrigins = ["https://agiigo.com", "http://localhost:3000"];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // This is important for cookies
};

// ✅ Apply CORS middleware before JSON middleware
app.use(cors(corsOptions));

app.use(express.json());


const authenticateBuyer = async (req, res, next) => {
  let token = req.cookies.token || req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "buyer") {
      return res.status(403).json({ error: "Access denied. Buyer only." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

const authenticateSeller = async (req, res, next) => {
  let token = req.cookies.token || req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "seller") {
      return res.status(403).json({ error: "Access denied. Seller only." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

//Login and Signup Routes
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ error: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
      );
      console.log("Login: Token about to be set in cookie:", token);
      res.cookie("token", token, {
          httpOnly: true, 
          secure: process.env.NODE_ENV === "production" ? true : false, 
          sameSite: "strict", 
          maxAge: 7 * 24 * 60 * 60 * 1000, 
      });
      console.log("Login: Cookie has been set");
      res.json({
          message: "Login successful",
          user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
          },
          token,
      });
  } catch (error) {
      console.error("Login error:", error.name, error.message);
      res.status(500).json({ error: "Server error" });
  }
});

//Register 
app.post("/api/register", async (req, res) => {
try {
  const { name, email, role, password, contact } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  user = new User({
    name,
    email,
    role,
    password: hashedPassword,
    contact,
  });

  await user.save();

  // ✅ Generate JWT Token after registration
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // ✅ Set HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
} catch (error) {
  res.status(500).json({ message: "Server error", error: error.message });
}
});

  //Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });

  //trending Products Routes
  app.get("/api/trending-products", async (req, res) => {
    try {
      const trendingProducts = await Product.find({ isTrending: true });
      res.json(trendingProducts);
    } catch (error) {
      console.error("Error fetching trending products:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
// New Arrivals Route (Products from Last 24 Hours)
app.get("/api/new-arrivals", async (req, res) => {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1); // 24 hours ago
  
      const newArrivals = await Product.find({ createdAt: { $gte: oneDayAgo } }).sort({ createdAt: -1 });
      res.json(newArrivals);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });  
//fetch single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });

//LogOut
app.post("/api/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" });
  res.json({ message: "Logged out successfully" });
});

   // SELLER UPLOAD PRODUCTS ROUTES 
  app.post("/api/products", authenticateSeller, async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;

        if (!name || !description || !price || !category) {
            console.log("Missing fields:", req.body);
            return res.status(400).json({ error: "All fields are required" });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            image,
            seller: req.user._id, // Assign the seller ID
        });

        await newProduct.save();

        // Add product reference in seller's products array
        await User.findByIdAndUpdate(req.user._id, {
            $push: { products: newProduct._id }
        });

        res.status(201).json({ message: "Product uploaded successfully", product: newProduct });
    } catch (err) {
        console.error("Error uploading product:", err);
        res.status(500).json({ error: "Failed to upload product", details: err.message });
    }
  });
  app.post("/api/products/csv", authenticateSeller, upload.single("file"), async (req, res) => {
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
                  seller: req.user._id, // Assign the seller ID
              });
          }
      })
      .on("end", async () => {
          try {
              const products = await Product.insertMany(results);

              // Store products in seller's user document
              await User.findByIdAndUpdate(req.user._id, {
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

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });