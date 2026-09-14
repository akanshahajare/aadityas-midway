const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
  connectDatabase,
} = require("./config/database");

const menuRoutes = require("./routes/menuRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const {
  authenticateUser,
} = require("./middleware/authMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;

// -------------------------
// Middleware
// -------------------------

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",
  })
);

app.use(express.json());

// -------------------------
// Routes
// -------------------------

app.use("/api/menu", menuRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/users", userRoutes);

app.use("/api/categories", categoryRoutes);

// Protected authentication test
app.get(
  "/api/auth/me",
  authenticateUser,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: req.user,
    });
  }
);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Aaditya's Midway API is running",
    environment:
      process.env.NODE_ENV || "development",
  });
});

// -------------------------
// 404 Handler
// -------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// -------------------------
// Error Handler
// -------------------------

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message || "Internal server error",
  });
});

// -------------------------
// Start Server
// -------------------------

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(
        `Backend server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();