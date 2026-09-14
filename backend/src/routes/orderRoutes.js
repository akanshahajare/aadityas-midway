const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getOrdersByUserId,
} = require("../controllers/orderController");

const {
  authenticateUser,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new order
router.post(
  "/",
  authenticateUser,
  createOrder
);

// Get all orders belonging to the logged-in customer
router.get(
  "/my-orders",
  authenticateUser,
  getMyOrders
);

// Update order status - Admin only
router.patch(
  "/:orderId/status",
  authenticateUser,
  requireAdmin,
  updateOrderStatus
);

// Get one order belonging to the logged-in customer
router.get(
  "/:orderId",
  authenticateUser,
  getOrderById
);

// Get all customer orders - Admin only
router.get(
  "/admin/all",
  authenticateUser,
  requireAdmin,
  getAllOrders
);

// Get all customer orders by user ID - Admin only
router.get(
  "/admin/user/:userId",
  authenticateUser,
  requireAdmin,
  getOrdersByUserId
);

module.exports = router;