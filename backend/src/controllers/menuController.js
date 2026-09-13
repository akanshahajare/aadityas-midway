const MenuItem = require("../models/MenuItem");

// GET /api/menu
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({
      isAvailable: true,
    }).sort({
      "category.name": 1,
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    console.error("Failed to fetch menu:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch menu",
    });
  }
};


// GET /api/menu/categories
const getCategories = async (req, res) => {
  try {
    const categories = await MenuItem.aggregate([
      {
        $match: {
          isAvailable: true,
        },
      },
      {
        $group: {
          _id: "$category.slug",
          name: {
            $first: "$category.name",
          },
          itemCount: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
    ]);

    const formattedCategories = categories.map((category) => ({
      slug: category._id,
      name: category.name,
      itemCount: category.itemCount,
    }));

    res.status(200).json({
      success: true,
      count: formattedCategories.length,
      data: formattedCategories,
    });
  } catch (error) {
    console.error(
      "Failed to fetch categories:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};


// GET /api/menu/category/:slug
const getMenuByCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    const menuItems = await MenuItem.find({
      "category.slug": slug,
      isAvailable: true,
    }).sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      category: slug,
      data: menuItems,
    });
  } catch (error) {
    console.error(
      "Failed to fetch category menu:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch category menu",
    });
  }
};


// GET /api/menu/:slug
const getMenuItemBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const menuItem = await MenuItem.findOne({
      slug,
      isAvailable: true,
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    console.error(
      "Failed to fetch menu item:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch menu item",
    });
  }
};


module.exports = {
  getAllMenuItems,
  getCategories,
  getMenuByCategory,
  getMenuItemBySlug,
};