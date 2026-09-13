const fs = require("fs");
const path = require("path");

// ============================================================
// CONFIGURATION
// ============================================================

const INPUT_FILE = path.join(
  __dirname,
  "..",
  "data",
  "raw",
  "menu.txt"
);

const OUTPUT_DIR = path.join(
  __dirname,
  "..",
  "data",
  "menus"
);

// ============================================================
// HELPERS
// ============================================================

function cleanText(text) {
  return text
    .trim()
    .replace(/\s+/g, " ");
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ============================================================
// PARSE MENU ITEM
// Supports:
//
// Plain Dal - 145
// * Manchow Soup — ₹95
// * Add Butter - +10
// ============================================================

function parseMenuItem(line) {
  let cleaned = line.trim();

  // Remove bullet characters
  cleaned = cleaned.replace(/^[-•*]\s*/, "");

  /*
    Match:

    Item Name - 145
    Item Name — ₹95
    Item Name - +10
  */

  const match = cleaned.match(
    /^(.+?)\s*[-—]\s*\+?\s*₹?\s*(\d+)\s*$/
  );

  if (!match) {
    return null;
  }

  const name = cleanText(match[1]);
  const price = Number(match[2]);

  return {
    name,
    slug: slugify(name),
    price
  };
}

// ============================================================
// DETECT WHETHER LINE IS A MENU ITEM
// ============================================================

function isMenuItem(line) {
  return /^[-•*]?\s*.+?\s*[-—]\s*\+?\s*₹?\s*\d+\s*$/.test(
    line
  );
}

// ============================================================
// SPECIAL INFORMATION
// ============================================================

function extractItemMetadata(name) {
  const metadata = {
    servingInfo: null,
    seasonal: false,
    isAddon: false
  };

  if (/serves\s+\d+/i.test(name)) {
    const match = name.match(/serves\s+\d+\s+persons?/i);

    if (match) {
      metadata.servingInfo = match[0];
    }
  }

  if (/seasonal/i.test(name)) {
    metadata.seasonal = true;
  }

  if (/^add\s+(butter|cheese)$/i.test(name)) {
    metadata.isAddon = true;
  }

  return metadata;
}

// ============================================================
// MAIN PARSER
// ============================================================

if (!fs.existsSync(INPUT_FILE)) {
  console.error("\n❌ Menu file not found:");
  console.error(INPUT_FILE);
  console.error(
    "\nMake sure your file exists at data/raw/menu.txt\n"
  );

  process.exit(1);
}

console.log("\n📖 Reading menu file...\n");

const rawContent = fs.readFileSync(
  INPUT_FILE,
  "utf8"
);

const lines = rawContent
  .split(/\r?\n/)
  .map(cleanText)
  .filter(Boolean);

// ============================================================
// PARSE CATEGORIES
// ============================================================

const categories = [];

let currentCategory = null;

for (const line of lines) {

  // ----------------------------------------------------------
  // Ignore informational lines
  // ----------------------------------------------------------

  if (
    /^here is the extracted menu/i.test(line) ||
    /^note:/i.test(line) ||
    /^\(note:/i.test(line)
  ) {
    continue;
  }

  // ----------------------------------------------------------
  // Menu item
  // ----------------------------------------------------------

  if (isMenuItem(line)) {

    if (!currentCategory) {
      console.warn(
        `⚠️ Item found before category: ${line}`
      );

      continue;
    }

    const parsedItem = parseMenuItem(line);

    if (!parsedItem) {
      console.warn(
        `⚠️ Could not parse item: ${line}`
      );

      continue;
    }

    const metadata = extractItemMetadata(
      parsedItem.name
    );

    const item = {
      name: parsedItem.name,

      slug: parsedItem.slug,

      category: currentCategory.slug,

      price: parsedItem.price,

      description: "",

      image: null,

      isVeg: true,

      isAvailable: true,

      servingInfo: metadata.servingInfo,

      seasonal: metadata.seasonal,

      isAddon: metadata.isAddon
    };

    currentCategory.items.push(item);

    continue;
  }

  // ----------------------------------------------------------
  // Category
  // ----------------------------------------------------------

  currentCategory = {
    name: line,

    slug: slugify(line),

    items: []
  };

  categories.push(currentCategory);
}

// ============================================================
// REMOVE EMPTY CATEGORIES
// ============================================================

const validCategories = categories.filter(
  (category) => category.items.length > 0
);

// ============================================================
// CREATE OUTPUT DIRECTORY
// ============================================================

fs.mkdirSync(
  OUTPUT_DIR,
  {
    recursive: true
  }
);

// ============================================================
// WRITE CATEGORY JSON FILES
// ============================================================

console.log("📂 Creating category files...\n");

for (const category of validCategories) {

  const categoryDirectory = path.join(
    OUTPUT_DIR,
    category.slug
  );

  fs.mkdirSync(
    categoryDirectory,
    {
      recursive: true
    }
  );

  const outputFile = path.join(
    categoryDirectory,
    "menu.json"
  );

  fs.writeFileSync(
    outputFile,
    JSON.stringify(category, null, 2),
    "utf8"
  );

  console.log(
    `✅ ${category.name.padEnd(35)} ${category.items.length} items`
  );
}

// ============================================================
// MASTER MENU JSON
// ============================================================

const masterMenu = {
  restaurant: "Aaditya's Midway",

  generatedAt: new Date().toISOString(),

  totalCategories: validCategories.length,

  totalItems: validCategories.reduce(
    (total, category) =>
      total + category.items.length,
    0
  ),

  categories: validCategories
};

const masterFile = path.join(
  OUTPUT_DIR,
  "menu.json"
);

fs.writeFileSync(
  masterFile,
  JSON.stringify(masterMenu, null, 2),
  "utf8"
);

// ============================================================
// SUMMARY
// ============================================================

const totalItems = validCategories.reduce(
  (total, category) =>
    total + category.items.length,
  0
);

console.log("\n========================================");
console.log("           MENU PARSING COMPLETE");
console.log("========================================");
console.log(`Categories : ${validCategories.length}`);
console.log(`Items      : ${totalItems}`);
console.log(`Output     : ${OUTPUT_DIR}`);
console.log("========================================\n");