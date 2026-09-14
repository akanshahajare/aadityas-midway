const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const getAdminUsers = async (token) => {
  const response = await fetch(
    `${API_BASE_URL}/api/users/admin/all`,
    {
      headers: getAuthHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const getAdminUserById = async (token, id) => {
  const response = await fetch(
    `${API_BASE_URL}/api/users/admin/${id}`,
    {
      headers: getAuthHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
};