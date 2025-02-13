const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const server= express();
const User = require("./models/User");
const Product = require("./models/Product");

require("dotenv").config(); // Load environment variables

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev }); // Next.js instance
const handle = app.getRequestHandler(); // Next.js request handler

server.use(cors());
server.use(express.json());

mongoose
  .connect("mongodb+srv://shivika:agiigo_karan@cluster0.reo6o.mongodb.net/agiigo-next")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


  //Product routes
  server.get("/api/products", async (req, res) => {
    try {
      const products = await Product.find({});
      console.log("Fetched Products:", products); // ✅ Debugging log
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
  server.post("/api/products", async (req, res) => {
    try {
      const { name, description, price, category, image } = req.body;
      const newProduct = new Product({ name, description, price, category, image });
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(500).json({ error: "Failed to add product" });
    }
  });

  //trending Products Routes
  server.get("/api/trending-products", async (req, res) => {
    try {
      const trendingProducts = await Product.find({ isTrending: true });
      res.json(trendingProducts);
    } catch (error) {
      console.error("Error fetching trending products:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
// New Arrivals Route (Products from Last 24 Hours)
server.get("/api/new-arrivals", async (req, res) => {
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
  server.get("/api/products/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
  //Login and Signup Routes
  server.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);  // ✅ Logs error to the terminal
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

//Register 
   server.post("/api/register", async (req, res) => {
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
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
  });

  const PORT = 4000;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });