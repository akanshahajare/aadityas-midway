const PEXELS_API_URL = "https://api.pexels.com/v1/search";

const searchPexelsImage = async (query) => {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    throw new Error("PEXELS_API_KEY is not configured");
  }

  const url = new URL(PEXELS_API_URL);

  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "10");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("size", "medium");
  url.searchParams.set("locale", "en-US");

  const response = await fetch(url, {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Pexels API request failed (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();

  if (!data.photos || data.photos.length === 0) {
    return null;
  }

  const photo = data.photos[0];

  if (!photo.src?.large) {
    return null;
  }

  return {
    src: photo.src.large,
    alt: query,
    type: "representative",
    provider: "pexels",
    providerPhotoId: photo.id,
    providerUrl: photo.url,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
  };
};

module.exports = {
  searchPexelsImage,
};