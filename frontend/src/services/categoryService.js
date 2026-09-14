const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// Public: get active categories
export const getCategories = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/categories`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch categories"
    );
  }

  return data;
};

// Public: get one category
export const getCategoryById = async (categoryId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/categories/${categoryId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch category"
    );
  }

  return data;
};

// Admin: get all categories
export const getAdminCategories = async (token) => {
  const response = await fetch(
    `${API_BASE_URL}/api/categories/admin/all`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch admin categories"
    );
  }

  return data;
};

// Admin: create category
export const createCategory = async (
  categoryData,
  token
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/categories/admin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to create category"
    );
  }

  return data;
};

// Admin: update category
export const updateCategory = async (
  categoryId,
  categoryData,
  token
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/categories/admin/${categoryId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update category"
    );
  }

  return data;
};

// Admin: delete category
export const deleteCategory = async (
  categoryId,
  token
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/categories/admin/${categoryId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to delete category"
    );
  }

  return data;
};