const express = require("express");

const {
  getAllUsers,
  getUserById,
} = require("../controllers/userController");

const {
  authenticateUser,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin: fetch all users
router.get(
  "/admin/all",
  authenticateUser,
  requireAdmin,
  getAllUsers
);

// Admin: fetch a single user
router.get(
  "/admin/:id",
  authenticateUser,
  requireAdmin,
  getUserById
);

module.exports = router;