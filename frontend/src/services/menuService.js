const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getMenu = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/menu`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch menu");
  }

  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/menu/categories`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};

export const getMenuByCategory = async (slug) => {
  const response = await fetch(
    `${API_BASE_URL}/api/menu/category/${slug}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch category menu");
  }

  return response.json();
};

export const getMenuItem = async (slug) => {
  const response = await fetch(
    `${API_BASE_URL}/api/menu/${slug}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch menu item");
  }

  return response.json();
};