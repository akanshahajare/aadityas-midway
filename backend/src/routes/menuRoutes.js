const express = require("express");

const {
  getAllMenuItems,
  getCategories,
  getMenuByCategory,
  getMenuItemBySlug,
} = require("../controllers/menuController");

const router = express.Router();

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
  "/:slug",
  getMenuItemBySlug
);

module.exports = router;