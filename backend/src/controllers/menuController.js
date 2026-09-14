const mongoose = require("mongoose");

const MenuItem = require("../models/MenuItem");
const Category = require("../models/Category");
const {
  searchPexelsImage,
} = require("../services/pexelsService");

// GET /api/menu
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({
      isAvailable: true,
    })
      .populate("category", "name slug")
      .sort({
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

// GET /api/menu/admin/all
const getAllMenuItemsAdmin = async (req, res) => {
  try {
    const items = await MenuItem.find({})
      .populate("category", "name slug")
      .sort({
        name: 1,
      });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error(
      "Error fetching admin menu items:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch menu items",
    });
  }
};

// GET /api/menu/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    })
      .sort({
        displayOrder: 1,
        name: 1,
      })
      .lean();

    const formattedCategories = [];

    for (const category of categories) {
      const itemCount = await MenuItem.countDocuments({
        category: category._id,
        isAvailable: true,
      });

      formattedCategories.push({
        _id: category._id,
        slug: category.slug,
        name: category.name,
        description: category.description,
        displayOrder: category.displayOrder,
        itemCount,
      });
    }

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

    const category = await Category.findOne({
      slug: slug.trim().toLowerCase(),
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const menuItems = await MenuItem.find({
      category: category._id,
      isAvailable: true,
    })
      .populate("category", "name slug")
      .sort({
        name: 1,
      });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      category: category.slug,
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
    }).populate("category", "name slug");

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

// GET /api/menu/:slug/image
const getMenuItemImage = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const item = await MenuItem.findOne({ slug });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // Return cached image if already available
    if (item.image?.src) {
      return res.json({
        success: true,
        cached: true,
        data: item.image,
      });
    }

    const searchQuery =
      item.imageSearchQuery ||
      `${item.name} Indian restaurant food`;

    const image = await searchPexelsImage(
      searchQuery
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "No suitable image found",
      });
    }

    item.image = image;

    await item.save();

    return res.json({
      success: true,
      cached: false,
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/menu
// Admin only
const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      slug,
      category,
      price,
      description,
      image,
      imageSearchQuery,
      tags,
      dietary,
      spiceLevel,
      servingInfo,
      seasonal,
      isAddon,
      isAvailable,
    } = req.body;

    if (!name || !slug || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, slug and category are required",
      });
    }

    let categoryId = null;

    // Support the new category ID format
    if (
      typeof category === "string" &&
      mongoose.Types.ObjectId.isValid(category)
    ) {
      categoryId = category;
    }

    // Also support an object temporarily so existing
    // frontend requests don't immediately break.
    if (
      !categoryId &&
      typeof category === "object"
    ) {
      if (
        category._id &&
        mongoose.Types.ObjectId.isValid(category._id)
      ) {
        categoryId = category._id;
      } else if (category.slug) {
        const categoryDocument =
          await Category.findOne({
            slug: category.slug
              .trim()
              .toLowerCase(),
            isActive: true,
          });

        if (categoryDocument) {
          categoryId = categoryDocument._id;
        }
      }
    }

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "A valid category is required",
      });
    }

    const categoryDocument =
      await Category.findById(categoryId);

    if (!categoryDocument || !categoryDocument.isActive) {
      return res.status(400).json({
        success: false,
        message: "Category not found or inactive",
      });
    }

    if (price === undefined || price === null || price === "") {
      return res.status(400).json({
        success: false,
        message: "Price is required",
      });
    }

    const numericPrice = Number(price);

    if (
      Number.isNaN(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Price must be a valid non-negative number",
      });
    }

    const normalizedSlug =
      slug.trim().toLowerCase();

    const existingItem =
      await MenuItem.findOne({
        slug: normalizedSlug,
      });

    if (existingItem) {
      return res.status(409).json({
        success: false,
        message:
          "A menu item with this slug already exists",
      });
    }

    const menuItem =
      await MenuItem.create({
        name: name.trim(),
        slug: normalizedSlug,

        category: categoryDocument._id,

        price: numericPrice,
        description:
          description?.trim() || "",

        image: image || undefined,

        imageSearchQuery:
          imageSearchQuery?.trim() || "",

        tags: Array.isArray(tags)
          ? tags
          : [],

        dietary: {
          vegetarian:
            dietary?.vegetarian !== undefined
              ? Boolean(dietary.vegetarian)
              : true,

          jain:
            dietary?.jain !== undefined
              ? Boolean(dietary.jain)
              : false,
        },

        spiceLevel:
          spiceLevel || null,

        servingInfo:
          servingInfo?.trim() || null,

        seasonal: Boolean(seasonal),
        isAddon: Boolean(isAddon),

        isAvailable:
          isAvailable !== undefined
            ? Boolean(isAvailable)
            : true,
      });

    await menuItem.populate(
      "category",
      "name slug"
    );

    return res.status(201).json({
      success: true,
      message:
        "Menu item created successfully",
      data: menuItem,
    });
  } catch (error) {
    console.error(
      "Failed to create menu item:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A menu item with this slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to create menu item",
    });
  }
};

// PUT /api/menu/:id
// Admin only
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const menuItem =
      await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const {
      name,
      slug,
      category,
      price,
      description,
      image,
      imageSearchQuery,
      tags,
      dietary,
      spiceLevel,
      servingInfo,
      seasonal,
      isAddon,
      isAvailable,
    } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      menuItem.name = name.trim();
    }

    if (slug !== undefined) {
      if (!slug.trim()) {
        return res.status(400).json({
          success: false,
          message: "Slug cannot be empty",
        });
      }

      const normalizedSlug =
        slug.trim().toLowerCase();

      const existingItem =
        await MenuItem.findOne({
          slug: normalizedSlug,
          _id: { $ne: id },
        });

      if (existingItem) {
        return res.status(409).json({
          success: false,
          message:
            "A menu item with this slug already exists",
        });
      }

      menuItem.slug = normalizedSlug;
    }

    if (category !== undefined) {
      let categoryId = null;

      if (
        typeof category === "string" &&
        mongoose.Types.ObjectId.isValid(category)
      ) {
        categoryId = category;
      }

      if (
        !categoryId &&
        typeof category === "object"
      ) {
        if (
          category._id &&
          mongoose.Types.ObjectId.isValid(
            category._id
          )
        ) {
          categoryId = category._id;
        } else if (category.slug) {
          const categoryDocument =
            await Category.findOne({
              slug: category.slug
                .trim()
                .toLowerCase(),
              isActive: true,
            });

          if (categoryDocument) {
            categoryId =
              categoryDocument._id;
          }
        }
      }

      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message:
            "A valid category is required",
        });
      }

      const categoryDocument =
        await Category.findById(categoryId);

      if (
        !categoryDocument ||
        !categoryDocument.isActive
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Category not found or inactive",
        });
      }

      menuItem.category =
        categoryDocument._id;
    }

    if (price !== undefined) {
      const numericPrice = Number(price);

      if (
        Number.isNaN(numericPrice) ||
        numericPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Price must be a valid non-negative number",
        });
      }

      menuItem.price = numericPrice;
    }

    if (description !== undefined) {
      menuItem.description =
        description?.trim() || "";
    }

    if (image !== undefined) {
      menuItem.image = image;
    }

    if (imageSearchQuery !== undefined) {
      menuItem.imageSearchQuery =
        imageSearchQuery?.trim() || "";
    }

    if (tags !== undefined) {
      menuItem.tags =
        Array.isArray(tags)
          ? tags
          : [];
    }

    if (dietary !== undefined) {
      menuItem.dietary = {
        vegetarian:
          dietary?.vegetarian !== undefined
            ? Boolean(
                dietary.vegetarian
              )
            : menuItem.dietary
                ?.vegetarian ?? true,

        jain:
          dietary?.jain !== undefined
            ? Boolean(dietary.jain)
            : menuItem.dietary
                ?.jain ?? false,
      };
    }

    if (spiceLevel !== undefined) {
      menuItem.spiceLevel =
        spiceLevel || null;
    }

    if (servingInfo !== undefined) {
      menuItem.servingInfo =
        servingInfo?.trim() || null;
    }

    if (seasonal !== undefined) {
      menuItem.seasonal =
        Boolean(seasonal);
    }

    if (isAddon !== undefined) {
      menuItem.isAddon =
        Boolean(isAddon);
    }

    if (isAvailable !== undefined) {
      menuItem.isAvailable =
        Boolean(isAvailable);
    }

    await menuItem.save();

    await menuItem.populate(
      "category",
      "name slug"
    );

    return res.status(200).json({
      success: true,
      message:
        "Menu item updated successfully",
      data: menuItem,
    });
  } catch (error) {
    console.error(
      "Failed to update menu item:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A menu item with this slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to update menu item",
    });
  }
};

// DELETE /api/menu/:id
// Admin only
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const menuItem =
      await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Menu item deleted successfully",
      data: {
        id: menuItem._id,
      },
    });
  } catch (error) {
    console.error(
      "Failed to delete menu item:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete menu item",
    });
  }
};

module.exports = {
  getAllMenuItems,
  getCategories,
  getMenuByCategory,
  getMenuItemBySlug,
  getMenuItemImage,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItemsAdmin,
};