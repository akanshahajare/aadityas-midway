const mongoose = require("mongoose");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const {
      items,
      orderType,
      customer,
      tableNumber,
      deliveryAddress,
      payment,
    } = req.body;

    // -----------------------------
    // Basic validation
    // -----------------------------
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    if (!["dine-in", "takeaway", "delivery"].includes(orderType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order type",
      });
    }

    if (!customer?.name || !customer?.phone) {
      return res.status(400).json({
        success: false,
        message: "Customer name and phone are required",
      });
    }

    // -----------------------------
    // Order-type specific validation
    // -----------------------------
    if (orderType === "dine-in" && !tableNumber) {
      return res.status(400).json({
        success: false,
        message: "Table number is required for dine-in orders",
      });
    }

    if (orderType === "delivery") {
      if (
        !deliveryAddress?.address ||
        !deliveryAddress?.city ||
        !deliveryAddress?.pincode
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Address, city and pincode are required for delivery orders",
        });
      }
    }

    if (!payment?.method || !["cash", "online"].includes(payment.method)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // -----------------------------
    // Validate cart items
    // -----------------------------
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.menuItem)) {
        return res.status(400).json({
          success: false,
          message: "Invalid menu item ID",
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
        return res.status(400).json({
          success: false,
          message: "Invalid item quantity",
        });
      }
    }

    // -----------------------------
    // Fetch actual menu items
    // -----------------------------
    const menuItemIds = items.map((item) => item.menuItem);

    const menuItems = await MenuItem.find({
      _id: { $in: menuItemIds },
      isAvailable: true,
    });

    if (menuItems.length !== items.length) {
      return res.status(400).json({
        success: false,
        message:
          "One or more menu items are unavailable or no longer exist",
      });
    }

    // -----------------------------
    // Build order items
    // -----------------------------
    const orderItems = items.map((requestedItem) => {
      const menuItem = menuItems.find(
        (item) => item._id.toString() === requestedItem.menuItem.toString()
      );

      return {
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: Number(requestedItem.quantity),
      };
    });

    // -----------------------------
    // Calculate pricing on server
    // -----------------------------
    const subtotal = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const gst = Number((subtotal * 0.05).toFixed(2));
    const total = Number((subtotal + gst).toFixed(2));

    // -----------------------------
    // Create order
    // -----------------------------
    const order = await Order.create({
      user: req.user.id,

      items: orderItems,

      orderType,

      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim().toLowerCase() || "",
      },

      tableNumber:
        orderType === "dine-in" ? tableNumber.trim() : null,

      deliveryAddress:
        orderType === "delivery"
          ? {
              address: deliveryAddress.address.trim(),
              city: deliveryAddress.city.trim(),
              pincode: deliveryAddress.pincode.trim(),
            }
          : {
              address: null,
              city: null,
              pincode: null,
            },

      pricing: {
        subtotal,
        gst,
        total,
      },

      payment: {
        method: payment.method,
        status: "pending",
      },

      status: "received",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create order failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get my orders failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// GET /api/orders/:orderId
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order by ID failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// PATCH /api/orders/:orderId/status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const allowedStatuses = [
      "received",
      "preparing",
      "ready",
      "served",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update order status failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

// GET /api/orders/admin/all
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get all orders failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getOrdersByUserId,
};