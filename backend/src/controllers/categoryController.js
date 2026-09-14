const mongoose = require("mongoose");

const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");

// GET /api/categories
// Public
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    }).sort({
      displayOrder: 1,
      name: 1,
    });

    const categoriesWithCounts =
      await Promise.all(
        categories.map(async (category) => {
          const itemCount =
            await MenuItem.countDocuments({
              category: category._id,
              isAvailable: true,
            });

          return {
            ...category.toObject(),
            itemCount,
          };
        })
      );

    res.status(200).json({
      success: true,
      count: categoriesWithCounts.length,
      data: categoriesWithCounts,
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

// GET /api/categories/admin/all
// Admin only
const getAllCategoriesAdmin = async (
  req,
  res
) => {
  try {
    const categories = await Category.find({})
      .sort({
        displayOrder: 1,
        name: 1,
      })
      .lean();

    const categoriesWithCounts =
      await Promise.all(
        categories.map(async (category) => {
          const totalItems =
            await MenuItem.countDocuments({
              category: category._id,
            });

          const availableItems =
            await MenuItem.countDocuments({
              category: category._id,
              isAvailable: true,
            });

          return {
            ...category,
            itemCount: totalItems,
            availableItemCount:
              availableItems,
          };
        })
      );

    res.status(200).json({
      success: true,
      count: categoriesWithCounts.length,
      data: categoriesWithCounts,
    });
  } catch (error) {
    console.error(
      "Failed to fetch admin categories:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// GET /api/categories/:id
// Public
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findOne({
      _id: id,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const itemCount =
      await MenuItem.countDocuments({
        category: category._id,
        isAvailable: true,
      });

    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        itemCount,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch category:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

// POST /api/categories
// Admin only
const createCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      isActive,
      displayOrder,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (!slug || !slug.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category slug is required",
      });
    }

    const normalizedName = name.trim();
    const normalizedSlug =
      slug.trim().toLowerCase();

    const existingCategory =
      await Category.findOne({
        $or: [
          { name: normalizedName },
          { slug: normalizedSlug },
        ],
      });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message:
          "A category with this name or slug already exists",
      });
    }

    const category =
      await Category.create({
        name: normalizedName,
        slug: normalizedSlug,
        description:
          description?.trim() || "",
        isActive:
          isActive !== undefined
            ? Boolean(isActive)
            : true,
        displayOrder:
          displayOrder !== undefined
            ? Number(displayOrder) || 0
            : 0,
      });

    res.status(201).json({
      success: true,
      message:
        "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error(
      "Failed to create category:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A category with this name or slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// PUT /api/categories/:id
// Admin only
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category =
      await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const {
      name,
      slug,
      description,
      isActive,
      displayOrder,
    } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Category name cannot be empty",
        });
      }

      category.name = name.trim();
    }

    if (slug !== undefined) {
      if (!slug.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Category slug cannot be empty",
        });
      }

      category.slug =
        slug.trim().toLowerCase();
    }

    if (description !== undefined) {
      category.description =
        description?.trim() || "";
    }

    if (isActive !== undefined) {
      category.isActive =
        Boolean(isActive);
    }

    if (displayOrder !== undefined) {
      const numericOrder =
        Number(displayOrder);

      if (
        Number.isNaN(numericOrder) ||
        numericOrder < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Display order must be a non-negative number",
        });
      }

      category.displayOrder =
        numericOrder;
    }

    const duplicateCategory =
      await Category.findOne({
        _id: { $ne: id },
        $or: [
          { name: category.name },
          { slug: category.slug },
        ],
      });

    if (duplicateCategory) {
      return res.status(409).json({
        success: false,
        message:
          "Another category with this name or slug already exists",
      });
    }

    await category.save();

    res.status(200).json({
      success: true,
      message:
        "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error(
      "Failed to update category:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A category with this name or slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to update category",
    });
  }
};

// DELETE /api/categories/:id
// Admin only
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category =
      await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // A category cannot be deleted while
    // menu items still reference it.
    const itemCount =
      await MenuItem.countDocuments({
        category: category._id,
      });

    if (itemCount > 0) {
      return res.status(409).json({
        success: false,
        message:
          `Cannot delete "${category.name}" because ${itemCount} menu item${
            itemCount === 1
              ? ""
              : "s"
          } still use this category.`,
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message:
        "Category deleted successfully",
      data: {
        id: category._id,
      },
    });
  } catch (error) {
    console.error(
      "Failed to delete category:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete category",
    });
  }
};

module.exports = {
  getAllCategories,
  getAllCategoriesAdmin,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};