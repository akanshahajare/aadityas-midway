const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");

const INPUT_FILE = path.join(
  ROOT_DIR,
  "data",
  "enriched",
  "menu.json"
);

const OUTPUT_DIR = path.join(
  ROOT_DIR,
  "data",
  "enriched"
);

const OUTPUT_FILE = path.join(
  OUTPUT_DIR,
  "image-manifest.json"
);

// Creates a search query that can later be used
// to find a suitable representative food image.
const createSearchQuery = (item, category) => {
  const name = item.name.trim();

  return `${name} ${category} Indian restaurant food`;
};

// Creates the initial image object.
// The actual URL will be added later.
const createImageObject = (item) => {
  return {
    src: null,
    alt: `${item.name} food`,
    type: "representative",
    provider: null
  };
};

const generateManifest = () => {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  const menu = JSON.parse(
    fs.readFileSync(INPUT_FILE, "utf8")
  );

  const manifest = [];

  for (const category of menu.categories || []) {
    for (const item of category.items || []) {
      manifest.push({
        name: item.name,
        slug: item.slug,

        category: {
          name: category.name,
          slug: category.slug
        },

        price: item.price,

        searchQuery:
          item.imageSearchQuery ||
          createSearchQuery(item, category.name),

        image: createImageObject(item),

        descriptionStatus:
          item.descriptionStatus || "needs-review",

        status: "pending"
      });
    }
  }

  fs.mkdirSync(OUTPUT_DIR, {
    recursive: true
  });

  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(manifest, null, 2),
    "utf8"
  );

  console.log("Image manifest generated successfully.");
  console.log(`Total images needed : ${manifest.length}`);
  console.log(`Output              : ${OUTPUT_FILE}`);
};

generateManifest();