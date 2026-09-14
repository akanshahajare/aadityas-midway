const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const createOrder = async (orderData, token) => {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to place order"
    );
  }

  return data;
};

export const getMyOrders = async (token) => {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/my-orders`,
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
      data.message || "Failed to fetch orders"
    );
  }

  return data;
};

export const getOrderById = async (orderId, token) => {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/${orderId}`,
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
      data.message || "Failed to fetch order"
    );
  }

  return data;
};

export const updateOrderStatus = async (
  orderId,
  status,
  token
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update order status"
    );
  }

  return data;
};

// Admin: get all orders
export const getAllOrders = async (token) => {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/admin/all`,
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
      data.message || "Failed to fetch all orders"
    );
  }

  return data;
};

export const getOrdersByUserId = async (userId, token) => {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/admin/user/${userId}`,
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
      data.message || "Failed to fetch user orders"
    );
  }

  return data;
};