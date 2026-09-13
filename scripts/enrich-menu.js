const fs = require("fs");
const path = require("path");

// ============================================================
// PATHS
// ============================================================

const INPUT_FILE = path.join(
  __dirname,
  "..",
  "data",
  "menus",
  "menu.json"
);

const OUTPUT_DIR = path.join(
  __dirname,
  "..",
  "data",
  "enriched"
);

// ============================================================
// HELPERS
// ============================================================

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(text) {
  return text
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// ============================================================
// DESCRIPTION GENERATOR
// ============================================================

function generateDescription(name) {
  const lower = name.toLowerCase();

  // ----------------------------------------------------------
  // Dal
  // ----------------------------------------------------------

  if (lower.includes("dal makh")) {
    return "Rich and creamy black lentils cooked with aromatic Indian spices.";
  }

  if (lower.includes("dal fry")) {
    return "Yellow lentils tempered with aromatic spices for a comforting classic.";
  }

  if (lower.includes("dal tadka")) {
    return "Comforting lentils finished with a flavorful tempering of Indian spices.";
  }

  if (lower.includes("dal varhadi")) {
    return "A flavorful Maharashtrian-style dal prepared with aromatic spices.";
  }

  if (lower === "plain dal") {
    return "Simple and comforting lentils prepared with traditional Indian spices.";
  }

  // ----------------------------------------------------------
  // Paneer
  // ----------------------------------------------------------

  if (lower.includes("paneer butter masala")) {
    return "Soft paneer cubes cooked in a rich, creamy and mildly spiced tomato gravy.";
  }

  if (lower.includes("paneer tikka masala")) {
    return "Grilled paneer pieces served in a rich and aromatic spiced gravy.";
  }

  if (lower.includes("paneer kadhai")) {
    return "Paneer cooked with capsicum, onions and aromatic Indian spices.";
  }

  if (lower.includes("palak paneer")) {
    return "Soft paneer cooked in a smooth, flavorful spinach gravy.";
  }

  if (lower.includes("mutter paneer")) {
    return "Paneer and green peas cooked together in a flavorful Indian gravy.";
  }

  if (lower.includes("shahi paneer")) {
    return "Soft paneer prepared in a rich, creamy and mildly spiced gravy.";
  }

  if (lower.includes("paneer bhurji")) {
    return "Crumbled paneer cooked with onions, tomatoes and aromatic Indian spices.";
  }

  if (lower.includes("paneer tikka")) {
    return "Marinated paneer pieces grilled with aromatic spices for a smoky finish.";
  }

  // ----------------------------------------------------------
  // Tandoori
  // ----------------------------------------------------------

  if (lower.includes("tandoori mushroom")) {
    return "Mushrooms marinated with aromatic spices and prepared with a smoky tandoori finish.";
  }

  if (lower.includes("stuffed mushroom")) {
    return "Mushrooms filled with a flavorful stuffing and prepared with aromatic spices.";
  }

  if (lower.includes("hara bhara kebab")) {
    return "A flavorful vegetarian kebab prepared with green vegetables and aromatic spices.";
  }

  if (lower.includes("seekh kebab")) {
    return "Flavorful vegetarian kebabs seasoned with aromatic spices and grilled to perfection.";
  }

  // ----------------------------------------------------------
  // Chinese
  // ----------------------------------------------------------

  if (lower.includes("chilli paneer")) {
    return "Paneer tossed with peppers, onions and flavorful Indo-Chinese chilli sauce.";
  }

  if (lower.includes("manchurian")) {
    return "Crispy vegetable bites tossed in a flavorful Indo-Chinese Manchurian sauce.";
  }

  if (lower.includes("honey chilli potato")) {
    return "Crispy potato strips tossed in a sweet and mildly spicy chilli sauce.";
  }

  if (lower.includes("spring roll")) {
    return "Crispy rolls filled with seasoned vegetables and served as a delicious starter.";
  }

  if (lower.includes("chilli garlic mushroom")) {
    return "Mushrooms tossed with garlic, chilli and flavorful Indo-Chinese seasonings.";
  }

  // ----------------------------------------------------------
  // Rice
  // ----------------------------------------------------------

  if (lower.includes("fried rice")) {
    return "Fragrant rice wok-tossed with vegetables and flavorful seasonings.";
  }

  if (lower.includes("burnt garlic rice")) {
    return "Wok-tossed rice finished with aromatic roasted garlic and flavorful seasonings.";
  }

  if (lower.includes("schezwan rice")) {
    return "Wok-tossed rice prepared with vegetables and spicy Schezwan seasoning.";
  }

  if (lower.includes("pulao")) {
    return "Fragrant rice cooked with vegetables and aromatic spices.";
  }

  if (lower.includes("biryani")) {
    return "Aromatic rice layered with flavorful spices and prepared in a biryani style.";
  }

  if (lower.includes("khichdi")) {
    return "Comforting rice and lentils cooked together with aromatic Indian spices.";
  }

  // ----------------------------------------------------------
  // Noodles
  // ----------------------------------------------------------

  if (lower.includes("noodles")) {
    return "Wok-tossed noodles prepared with vegetables and flavorful Asian seasonings.";
  }

  // ----------------------------------------------------------
  // South Indian
  // ----------------------------------------------------------

  if (lower.includes("idli")) {
    return "Soft and fluffy South Indian steamed rice cakes served as a light and comforting meal.";
  }

  if (lower.includes("dosa")) {
    return "Crispy South Indian crepe prepared with a traditional fermented rice and lentil batter.";
  }

  if (lower.includes("uttapam")) {
    return "Soft and savory South Indian pancake topped with flavorful ingredients.";
  }

  if (lower.includes("upma")) {
    return "A comforting South Indian semolina preparation seasoned with aromatic spices.";
  }

  if (lower.includes("appe")) {
    return "Soft bite-sized South Indian savory dumplings prepared with a flavorful batter.";
  }

  if (lower.includes("sambhar wada")) {
    return "Crispy lentil fritters served with flavorful South Indian sambhar.";
  }

  // ----------------------------------------------------------
  // Sandwich
  // ----------------------------------------------------------

  if (lower.includes("sandwich")) {
    return "A freshly prepared sandwich with flavorful fillings and a satisfying toasted finish.";
  }

  if (lower.includes("garlic bread")) {
    return "Toasted bread topped with aromatic garlic and herbs.";
  }

  // ----------------------------------------------------------
  // Pizza
  // ----------------------------------------------------------

  if (lower.includes("pizza")) {
    return "Freshly baked pizza topped with flavorful ingredients and melted cheese.";
  }

  // ----------------------------------------------------------
  // Pasta
  // ----------------------------------------------------------

  if (lower.includes("red sauce pasta")) {
    return "Pasta tossed in a rich and flavorful tomato-based sauce.";
  }

  if (lower.includes("white sauce pasta")) {
    return "Creamy pasta tossed in a smooth and rich white sauce.";
  }

  if (lower.includes("pink sauce pasta")) {
    return "Creamy pasta prepared with a flavorful blend of tomato and white sauce.";
  }

  if (lower.includes("pasta")) {
    return "Pasta prepared with flavorful sauce and aromatic seasonings.";
  }

  // ----------------------------------------------------------
  // Fries / Nachos / Snacks
  // ----------------------------------------------------------

  if (lower.includes("french fries")) {
    return "Crispy golden potato fries seasoned for a delicious snack.";
  }

  if (lower.includes("nachos")) {
    return "Crispy nachos served with flavorful toppings for a satisfying snack.";
  }

  // ----------------------------------------------------------
  // Maggi
  // ----------------------------------------------------------

  if (lower.includes("maggi")) {
    return "A comforting bowl of noodles prepared with flavorful seasonings.";
  }

  // ----------------------------------------------------------
  // Paratha
  // ----------------------------------------------------------

  if (lower.includes("paratha")) {
    return "Indian flatbread prepared with a flavorful filling and cooked to a delicious finish.";
  }

  // ----------------------------------------------------------
  // Soup
  // ----------------------------------------------------------

  if (lower.includes("soup") || lower.includes("shorba")) {
    return "A warm and flavorful soup prepared with aromatic ingredients and seasonings.";
  }

  // ----------------------------------------------------------
  // Mocktails
  // ----------------------------------------------------------

  if (
    lower.includes("mojito") ||
    lower.includes("lemonade") ||
    lower.includes("lagoon") ||
    lower.includes("sunset")
  ) {
    return "A refreshing non-alcoholic beverage prepared with fruity and citrusy flavors.";
  }

  // ----------------------------------------------------------
  // Shakes
  // ----------------------------------------------------------

  if (lower.includes("shake")) {
    return "A creamy and refreshing milkshake blended with rich flavors.";
  }

  // ----------------------------------------------------------
  // Lassi
  // ----------------------------------------------------------

  if (lower.includes("lassi")) {
    return "A refreshing traditional Indian yogurt-based drink with a creamy texture.";
  }

  // ----------------------------------------------------------
  // Juice
  // ----------------------------------------------------------

  if (lower.includes("juice")) {
    return "A refreshing fruit juice prepared for a naturally fruity and refreshing drink.";
  }

  // ----------------------------------------------------------
  // Desserts
  // ----------------------------------------------------------

  if (lower.includes("gulab jamun")) {
    return "Soft and syrup-soaked Indian sweet served warm for a delicious dessert.";
  }

  if (lower.includes("rasgulla")) {
    return "Soft and spongy Indian sweet soaked in lightly flavored sugar syrup.";
  }

  if (lower.includes("rasmalai")) {
    return "Soft milk-based dumplings served in a rich and creamy sweetened milk.";
  }

  if (lower.includes("jalebi")) {
    return "Crispy spiral-shaped Indian sweet soaked in fragrant sugar syrup.";
  }

  if (lower.includes("halwa")) {
    return "A traditional Indian dessert prepared with rich ingredients and aromatic flavors.";
  }

  if (lower.includes("brownie")) {
    return "A warm and indulgent chocolate dessert served with a rich, comforting texture.";
  }

  if (lower.includes("custard")) {
    return "A smooth and creamy dessert with a delicate caramelized sweetness.";
  }

  // ----------------------------------------------------------
  // Generic fallback
  // ----------------------------------------------------------

  return "";
}

// ============================================================
// TAG GENERATOR
// ============================================================

function generateTags(name, category) {
  const text = `${name} ${category}`.toLowerCase();

  const tags = [];

  if (text.includes("paneer")) tags.push("paneer");
  if (text.includes("rice")) tags.push("rice");
  if (text.includes("noodle")) tags.push("noodles");
  if (text.includes("dosa")) tags.push("south-indian");
  if (text.includes("idli")) tags.push("south-indian");
  if (text.includes("pizza")) tags.push("pizza");
  if (text.includes("pasta")) tags.push("pasta");
  if (text.includes("tandoori")) tags.push("tandoori");
  if (text.includes("kebab")) tags.push("kebab");
  if (text.includes("soup")) tags.push("soup");
  if (text.includes("shake")) tags.push("shake");
  if (text.includes("juice")) tags.push("juice");
  if (text.includes("dessert")) tags.push("dessert");
  if (text.includes("chinese")) tags.push("indo-chinese");
  if (text.includes("mocktail")) tags.push("mocktail");

  if (
    text.includes("chilli") ||
    text.includes("schezwan") ||
    text.includes("peri peri")
  ) {
    tags.push("spicy");
  }

  if (
    text.includes("cheese") ||
    text.includes("butter") ||
    text.includes("cream")
  ) {
    tags.push("creamy");
  }

  return [...new Set(tags)];
}

// ============================================================
// IMAGE SEARCH QUERY
// ============================================================

function generateImageSearchQuery(name) {
  return `${name} Indian restaurant food`;
}

// ============================================================
// ENRICH ITEM
// ============================================================

function enrichItem(item, categoryName) {
  const description = generateDescription(item.name);

  return {
    ...item,

    description,

    descriptionStatus: description
      ? "generated"
      : "needs-review",

    image: null,

    imageSearchQuery: generateImageSearchQuery(
      item.name
    ),

    tags: generateTags(
      item.name,
      categoryName
    ),

    dietary: {
      vegetarian: item.isVeg === true,
      jain: false
    },

    spiceLevel: null,

    servingInfo: item.servingInfo || null
  };
}

// ============================================================
// VALIDATE INPUT
// ============================================================

if (!fs.existsSync(INPUT_FILE)) {
  console.error(
    `❌ Input menu not found:\n${INPUT_FILE}`
  );

  process.exit(1);
}

// ============================================================
// READ MENU
// ============================================================

console.log("\n📖 Reading parsed menu...\n");

const menu = JSON.parse(
  fs.readFileSync(INPUT_FILE, "utf8")
);

// ============================================================
// CREATE OUTPUT
// ============================================================

fs.mkdirSync(
  OUTPUT_DIR,
  {
    recursive: true
  }
);

const enrichedCategories = [];

let totalItems = 0;
let generatedDescriptions = 0;
let needsReview = 0;

for (const category of menu.categories) {

  const enrichedItems = category.items.map(
    (item) => {

      const enriched = enrichItem(
        item,
        category.name
      );

      totalItems++;

      if (
        enriched.descriptionStatus ===
        "generated"
      ) {
        generatedDescriptions++;
      } else {
        needsReview++;
      }

      return enriched;
    }
  );

  const enrichedCategory = {
    name: category.name,

    slug: category.slug,

    items: enrichedItems
  };

  enrichedCategories.push(
    enrichedCategory
  );

  // ----------------------------------------------------------
  // Category folder
  // ----------------------------------------------------------

  const categoryDir = path.join(
    OUTPUT_DIR,
    category.slug
  );

  fs.mkdirSync(
    categoryDir,
    {
      recursive: true
    }
  );

  fs.writeFileSync(
    path.join(
      categoryDir,
      "menu.json"
    ),
    JSON.stringify(
      enrichedCategory,
      null,
      2
    ),
    "utf8"
  );
}

// ============================================================
// MASTER ENRICHED MENU
// ============================================================

const enrichedMenu = {
  restaurant: menu.restaurant,

  generatedAt: new Date().toISOString(),

  totalCategories:
    enrichedCategories.length,

  totalItems,

  generatedDescriptions,

  needsReview,

  categories:
    enrichedCategories
};

fs.writeFileSync(
  path.join(
    OUTPUT_DIR,
    "menu.json"
  ),
  JSON.stringify(
    enrichedMenu,
    null,
    2
  ),
  "utf8"
);

// ============================================================
// SUMMARY
// ============================================================

console.log(
  "========================================"
);

console.log(
  "       MENU ENRICHMENT COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  `Categories           : ${enrichedCategories.length}`
);

console.log(
  `Total items          : ${totalItems}`
);

console.log(
  `Descriptions created : ${generatedDescriptions}`
);

console.log(
  `Needs review         : ${needsReview}`
);

console.log(
  `Output               : ${OUTPUT_DIR}`
);

console.log(
  "========================================\n"
);