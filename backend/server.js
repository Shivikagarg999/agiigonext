const express= require('express')
const app= express();
const mongoose= require('mongoose')
const User = require("./models/User");
const cors= require('cors');
const bcrypt = require("bcryptjs");
const Product= require('./models/Product')
const jwt= require('jsonwebtoken')
app.use(express.json());
require('dotenv').config();
const multer= require('multer');
const upload = multer({ dest: "uploads/" });const fs = require("fs");
const csvParser = require("csv-parser");

mongoose
  .connect("mongodb+srv://shivika:agiigo_karan@cluster0.reo6o.mongodb.net/agiigo-next")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  const corsOptions = {
    origin: ['https://agiigo.com', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  app.use(cors(corsOptions));



// Middleware to authenticate seller
const authenticateSeller = (req, res, next) => {
  const token = req.headers['authorization']; // Token is typically passed in the Authorization header
  
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  // Verify the token using JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach user data to the request object
    req.user = decoded;

    // Check if the user is a seller 
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: "Unauthorized. Only sellers can perform this action." });
    }

    next();
  });
};
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
  //Login and Signup Routes
  app.post("/api/login", async (req, res) => {
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
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
  });
  // SELLER UPLAOD PRODUCTS
  app.post("/api/products", authenticateSeller, async (req, res) => {
    const { name, description, price, category, image } = req.body;
  
    try {
      const newProduct = new Product({ name, description, price, category, image });
      await newProduct.save();
  
      // Find the seller and add the product to their products array
      const user = await User.findById(req.user.userId); // Access the authenticated user's ID from the token
      if (!user) return res.status(404).json({ error: "Seller not found" });
  
      user.products.push(newProduct._id); // Add product ID to seller's products array
      await user.save();
  
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(500).json({ error: "Failed to add product" });
    }
  });  
  app.post("/api/products/csv", authenticateSeller, upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
  
    const results = [];
  
    // Parse the CSV file
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (row) => {
        const { name, description, price, category, image } = row;
        if (name && description && price && category) {
          results.push({ name, description, price: parseFloat(price), category, image });
        }
      })
      .on('end', async () => {
        try {
          const products = await Product.insertMany(results);
  
          // Find the seller and add the products to their products array
          const user = await User.findById(req.user.userId);
          if (!user) return res.status(404).json({ error: "Seller not found" });
  
          user.products.push(...products.map(product => product._id)); // Add all products to seller's products array
          await user.save();
  
          // Delete the uploaded CSV file after processing
          fs.unlinkSync(req.file.path);
  
          res.status(201).json({
            message: `${products.length} products added successfully!`,
            products,
          });
        } catch (err) {
          res.status(500).json({ error: "Failed to upload products" });
        }
      });
  });
//SELLER PRODUCTS DISPLAY
app.get("/api/seller/products", authenticateSeller, async (req, res) => {
  try {
    // Find all products for the logged-in seller
    const products = await Product.find({ seller: req.user.userId }); // Assuming 'seller' field in Product model
    res.json(products);
  } catch (error) {
    console.error("Error fetching seller's products:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });