const express = require("express");

const {
  getAllMenuItems,
  getAllMenuItemsAdmin,
  getCategories,
  getMenuByCategory,
  getMenuItemBySlug,
  getMenuItemImage,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const {
  authenticateUser,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public menu routes
router.get("/", getAllMenuItems);

router.get(
  "/categories",
  getCategories
);

router.get(
  "/category/:slug",
  getMenuByCategory
);

router.get(
  "/admin/all",
  authenticateUser,
  requireAdmin,
  getAllMenuItemsAdmin
);

// Fetch/generate menu item image
router.get(
  "/:slug/image",
  getMenuItemImage
);

router.get(
  "/:slug",
  getMenuItemBySlug
);

// Admin menu management
router.post(
  "/",
  authenticateUser,
  requireAdmin,
  createMenuItem
);

router.put(
  "/:id",
  authenticateUser,
  requireAdmin,
  updateMenuItem
);

router.delete(
  "/:id",
  authenticateUser,
  requireAdmin,
  deleteMenuItem
);

module.exports = router;
