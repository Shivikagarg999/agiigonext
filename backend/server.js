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
  // credentials: true,
};

// ✅ Apply CORS middleware before JSON middleware
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ✅ Ensure every response includes required CORS headers
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  if (allowedOrigins.includes(requestOrigin)) {
    res.header("Access-Control-Allow-Origin", requestOrigin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token; // Get JWT token from cookies

  if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Store user data in request
      next(); // Proceed to next middleware or route
  } catch (err) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

const authenticateSeller = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
      return res.status(401).json({ error: "No token provided" });
  }

  try {
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user || user.role !== "seller") {
          return res.status(403).json({ error: "Access denied. Seller only." });
      }

      req.user = user;
      next();
  } catch (error) {
      res.status(401).json({ error: "Invalid token" });
  }
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

        // ✅ Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true, // Prevents JavaScript access (XSS protection)
            secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
            sameSite: "strict", // Prevents CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
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
// GET SELLER PRODUCTS
// app.get('/api/products/seller', async (req, res) => {
//   try {
//     // Ensure `req.user.id` is a valid ObjectId
//     const userId = mongoose.Types.ObjectId(req.user.id); // Cast string to ObjectId

//     // Find products by the seller's user ID
//     const products = await Product.find({ user: userId });

//     if (products.length === 0) {
//       return res.status(404).json({ message: "No products found." });
//     }

//     return res.status(200).json({ products });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error", error });
//   }
// });

  //Cart Routes
 app.post("/api/cart/add", async (req, res) => {
  try {
      const { userId, productId, quantity } = req.body;
      if (!userId || !productId || !quantity) {
          return res.status(400).json({ error: "Missing required fields" });
      }

      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
          cart = new Cart({ user: userId, items: [] });
      }

      const productIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (productIndex > -1) {
          cart.items[productIndex].quantity += quantity;
      } else {
          cart.items.push({ product: productId, quantity });
      }

      await cart.save();
      res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
  }
});

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });