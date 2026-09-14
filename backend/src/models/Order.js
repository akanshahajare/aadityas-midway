const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    // Authenticated customer
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Items purchased
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },

    // Order type
    orderType: {
      type: String,
      enum: ["dine-in", "takeaway", "delivery"],
      required: true,
    },

    // Customer information
    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },
    },

    // Dine-in information
    tableNumber: {
      type: String,
      trim: true,
      default: null,
    },

    // Delivery information
    deliveryAddress: {
      address: {
        type: String,
        trim: true,
        default: null,
      },

      city: {
        type: String,
        trim: true,
        default: null,
      },

      pincode: {
        type: String,
        trim: true,
        default: null,
      },
    },

    // Pricing
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },

      gst: {
        type: Number,
        required: true,
        min: 0,
      },

      total: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    // Payment
    payment: {
      method: {
        type: String,
        enum: ["cash", "online"],
        required: true,
      },

      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
    },

    // Order lifecycle
    status: {
      type: String,
      enum: [
        "received",
        "preparing",
        "ready",
        "served",
        "completed",
        "cancelled",
      ],
      default: "received",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);

