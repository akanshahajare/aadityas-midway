const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const getAdminMenuItems = async (token) => {
  const response = await fetch(
    `${API_BASE_URL}/api/menu/admin/all`,
    {
      headers: getAuthHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch admin menu items");
  }

  return response.json();
};

export const createMenuItem = async (token, menuItem) => {
  const response = await fetch(
    `${API_BASE_URL}/api/menu`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(menuItem),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create menu item");
  }

  return response.json();
};

export const updateMenuItem = async (token, id, menuItem) => {
  const response = await fetch(
    `${API_BASE_URL}/api/menu/${id}`,
    {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(menuItem),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update menu item");
  }

  return response.json();
};

export const deleteMenuItem = async (token, id) => {
  const response = await fetch(
    `${API_BASE_URL}/api/menu/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete menu item");
  }

  return response.json();
};