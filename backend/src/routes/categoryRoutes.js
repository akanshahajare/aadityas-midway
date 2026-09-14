const express = require("express");

const {
  getAllCategories,
  getAllCategoriesAdmin,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  authenticateUser,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllCategories);

// Admin routes
// Keep these BEFORE /:id so "admin" isn't treated as a category ID.
router.get(
  "/admin/all",
  authenticateUser,
  requireAdmin,
  getAllCategoriesAdmin
);

router.post(
  "/admin",
  authenticateUser,
  requireAdmin,
  createCategory
);

router.patch(
  "/admin/:id",
  authenticateUser,
  requireAdmin,
  updateCategory
);

router.delete(
  "/admin/:id",
  authenticateUser,
  requireAdmin,
  deleteCategory
);

// Public single-category route
// Keep this AFTER all /admin routes.
router.get("/:id", getCategoryById);

module.exports = router;