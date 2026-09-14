const path = require("path");
const mongoose = require("mongoose");

// Load backend/.env explicitly
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const MenuItem = require("../src/models/MenuItem");
const Category = require("../src/models/Category");

const migrateCategories = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in backend/.env"
      );
    }

    // Connect to the same MongoDB database used by the backend
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    // Get all existing menu items
    const menuItems = await MenuItem.find({})
      .select("category")
      .lean();

    console.log(`Found ${menuItems.length} menu items`);

    // Build unique categories
    const categoriesMap = new Map();

    for (const item of menuItems) {
      if (!item.category?.name || !item.category?.slug) {
        continue;
      }

      const name = item.category.name.trim();
      const slug = item.category.slug.trim().toLowerCase();

      if (!categoriesMap.has(slug)) {
        categoriesMap.set(slug, {
          name,
          slug,
        });
      }
    }

    const categories = Array.from(
      categoriesMap.values()
    );

    console.log(
      `Found ${categories.length} unique categories`
    );

    // Create categories that don't already exist
    let createdCount = 0;
    let skippedCount = 0;

    for (const category of categories) {
      const existingCategory = await Category.findOne({
        $or: [
          { name: category.name },
          { slug: category.slug },
        ],
      });

      if (existingCategory) {
        skippedCount++;

        console.log(
          `Skipped existing category: ${category.name}`
        );

        continue;
      }

      await Category.create({
        name: category.name,
        slug: category.slug,
        description: "",
        isActive: true,
        displayOrder: createdCount,
      });

      createdCount++;

      console.log(
        `Created category: ${category.name} (${category.slug})`
      );
    }

    console.log("\n-------------------------");
    console.log("Category migration complete");
    console.log("-------------------------");
    console.log(`Total menu items: ${menuItems.length}`);
    console.log(
      `Unique categories: ${categories.length}`
    );
    console.log(`Created: ${createdCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log("-------------------------");

    await mongoose.disconnect();

    console.log("Disconnected from MongoDB");

    process.exit(0);
  } catch (error) {
    console.error(
      "Category migration failed:",
      error.message
    );

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    process.exit(1);
  }
};

migrateCategories();