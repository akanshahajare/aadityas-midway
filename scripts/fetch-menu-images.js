const fs = require("fs");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "..", "backend", ".env"),
});

// ============================================================
// PATHS
// ============================================================

const MENU_FILE = path.join(
  __dirname,
  "..",
  "data",
  "enriched",
  "menu.json"
);

const IMAGE_DIR = path.join(
  __dirname,
  "..",
  "data",
  "images"
);

// ============================================================
// CONFIG
// ============================================================

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

const MAX_ITEMS = 5;
const DELAY_MS = 1000;

// ============================================================
// VALIDATION
// ============================================================

if (!PEXELS_API_KEY) {
  console.error("PEXELS_API_KEY is missing.");
  console.error(
    "Add PEXELS_API_KEY to backend/.env before running this script."
  );
  process.exit(1);
}

if (!fs.existsSync(MENU_FILE)) {
  console.error(`Menu file not found: ${MENU_FILE}`);
  process.exit(1);
}

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

// ============================================================
// HELPERS
// ============================================================

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function getImageExtension(contentType) {
  if (contentType?.includes("png")) {
    return ".png";
  }

  if (contentType?.includes("webp")) {
    return ".webp";
  }

  return ".jpg";
}

async function searchPexels(query) {
  const url =
    `https://api.pexels.com/v1/search?` +
    new URLSearchParams({
      query,
      orientation: "landscape",
      size: "medium",
      locale: "en-US",
      per_page: "5",
      page: "1",
    });

  const response = await fetch(url, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Pexels API failed (${response.status}): ${errorText}`
    );
  }

  return response.json();
}

async function downloadImage(url, filePath) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Image download failed (${response.status})`
    );
  }

  const contentType = response.headers.get("content-type");

  const buffer = Buffer.from(await response.arrayBuffer());

  fs.writeFileSync(filePath, buffer);

  return {
    contentType,
    size: buffer.length,
  };
}

// ============================================================
// MAIN
// ============================================================

async function fetchMenuImages() {
  console.log("");
  console.log("=================================");
  console.log("Aaditya's Midway Image Fetcher");
  console.log("=================================");
  console.log("");

  const menu = JSON.parse(
    fs.readFileSync(MENU_FILE, "utf8")
  );

  const items = [];

  for (const category of menu.categories || []) {
    for (const item of category.items || []) {
      items.push(item);
    }
  }

  console.log(`Total menu items: ${items.length}`);
  console.log(`Testing first ${MAX_ITEMS} items...`);
  console.log("");

  let processed = 0;
  let successful = 0;
  let failed = 0;

  for (const item of items.slice(0, MAX_ITEMS)) {
    processed++;

    const query =
      item.imageSearchQuery ||
      `${item.name} Indian food restaurant`;

    console.log(
      `[${processed}/${Math.min(MAX_ITEMS, items.length)}] ${item.name}`
    );

    console.log(`  Search: ${query}`);

    try {
      const result = await searchPexels(query);

      if (!result.photos || result.photos.length === 0) {
        console.log("  No suitable image found.");
        failed++;
        continue;
      }

      const photo = result.photos[0];

      const imageUrl =
        photo.src?.large ||
        photo.src?.medium ||
        photo.src?.original;

      if (!imageUrl) {
        console.log("  Pexels result has no usable image URL.");
        failed++;
        continue;
      }

      const fileName = `${item.slug}.jpg`;

      const filePath = path.join(
        IMAGE_DIR,
        fileName
      );

      const downloadResult = await downloadImage(
        imageUrl,
        filePath
      );

      item.image = {
        src: `/images/${fileName}`,
        alt: item.name,
        type: "representative",
        provider: "pexels",
        providerPhotoId: photo.id,
        providerUrl: photo.url,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
      };

      console.log(
        `  ✓ Downloaded: ${fileName}`
      );

      console.log(
        `  ✓ Photographer: ${photo.photographer}`
      );

      console.log(
        `  ✓ Size: ${Math.round(
          downloadResult.size / 1024
        )} KB`
      );

      successful++;
    } catch (error) {
      console.error(
        `  ✗ Failed: ${error.message}`
      );

      failed++;
    }

    await sleep(DELAY_MS);
  }

  // ==========================================================
  // SAVE UPDATED MENU
  // ==========================================================

  fs.writeFileSync(
    MENU_FILE,
    JSON.stringify(menu, null, 2),
    "utf8"
  );

  console.log("");
  console.log("=================================");
  console.log("Image fetch completed");
  console.log("=================================");
  console.log(`Processed : ${processed}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed    : ${failed}`);
  console.log(`Image dir : ${IMAGE_DIR}`);
  console.log("");
}

fetchMenuImages().catch((error) => {
  console.error("");
  console.error("Image fetching failed.");
  console.error(error);
  process.exit(1);
});