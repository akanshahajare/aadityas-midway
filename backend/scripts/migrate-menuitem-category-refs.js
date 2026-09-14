const path = require("path");
const mongoose = require("mongoose");

// Load backend/.env explicitly
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const MenuItem = require("../src/models/MenuItem");
const Category = require("../src/models/Category");

const migrateMenuItemCategories = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in backend/.env"
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    const menuItems = await MenuItem.find({})
      .select("_id name category")
      .lean();

    console.log(
      `Found ${menuItems.length} menu items`
    );

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const item of menuItems) {
      try {
        const categorySlug = item.category?.slug;

        if (!categorySlug) {
          console.log(
            `Skipped "${item.name}" - no category slug`
          );

          skippedCount++;
          continue;
        }

        const category = await Category.findOne({
          slug: categorySlug.trim().toLowerCase(),
        });

        if (!category) {
          console.error(
            `Category not found for "${item.name}": ${categorySlug}`
          );

          errorCount++;
          continue;
        }

        await MenuItem.collection.updateOne(
          { _id: item._id },
          {
            $set: {
              category: category._id,
            },
          }
        );

        updatedCount++;

        console.log(
          `Updated: ${item.name} → ${category.name}`
        );
      } catch (error) {
        errorCount++;

        console.error(
          `Failed to update "${item.name}":`,
          error.message
        );
      }
    }

    console.log("\n-------------------------");
    console.log(
      "MenuItem category migration complete"
    );
    console.log("-------------------------");
    console.log(
      `Total menu items: ${menuItems.length}`
    );
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log("-------------------------");

    await mongoose.disconnect();

    console.log("Disconnected from MongoDB");

    if (errorCount > 0) {
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error(
      "MenuItem category migration failed:",
      error.message
    );

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    process.exit(1);
  }
};

migrateMenuItemCategories();