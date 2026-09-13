const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "..", "backend", ".env"),
});

const {
  connectDatabase,
  mongoose,
} = require("../backend/src/config/database");

const MenuItem = require("../backend/src/models/MenuItem");

const fs = require("fs");

const MENU_FILE = path.join(
  __dirname,
  "..",
  "data",
  "enriched",
  "menu.json"
);

const seedMenu = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await connectDatabase();

    console.log("Loading menu data...");

    const menu = JSON.parse(
      fs.readFileSync(MENU_FILE, "utf8")
    );

    const items = [];

    for (const category of menu.categories || []) {
      for (const item of category.items || []) {
        items.push({
          name: item.name,
          slug: item.slug,

          category: {
            name: category.name,
            slug: category.slug,
          },

          price: item.price,

          description:
            item.description || "",

          image: item.image || {
            src: null,
            alt: `${item.name} food`,
            type: "representative",
            provider: null,
          },

          tags: item.tags || [],

          dietary: item.dietary || {
            vegetarian: true,
            jain: false,
          },

          spiceLevel:
            item.spiceLevel || null,

          servingInfo:
            item.servingInfo || null,

          seasonal:
            item.seasonal || false,

          isAddon:
            item.isAddon || false,

          isAvailable:
            item.isAvailable !== false,
        });
      }
    }

    console.log(`Menu items found: ${items.length}`);

    const operations = items.map((item) => ({
      updateOne: {
        filter: {
          slug: item.slug,
        },

        update: {
          $set: item,
        },

        upsert: true,
      },
    }));

    console.log("Writing menu items to MongoDB...");

    const result = await MenuItem.bulkWrite(
      operations,
      {
        ordered: false,
      }
    );

    console.log("");
    console.log("=================================");
    console.log("Menu seed completed successfully");
    console.log("=================================");
    console.log(
      `Matched  : ${result.matchedCount}`
    );
    console.log(
      `Modified : ${result.modifiedCount}`
    );
    console.log(
      `Upserted : ${result.upsertedCount}`
    );
    console.log(
      `Total    : ${items.length}`
    );
  } catch (error) {
    console.error("");
    console.error("Menu seed failed.");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

seedMenu();