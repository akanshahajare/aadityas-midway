const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      src: {
        type: String,
        default: null,
      },

      alt: {
        type: String,
        default: "",
      },

      type: {
        type: String,
        enum: ["restaurant", "representative"],
        default: "representative",
      },

      provider: {
        type: String,
        default: null,
      },

      providerPhotoId: {
        type: Number,
        default: null,
      },

      providerUrl: {
        type: String,
        default: null,
      },

      photographer: {
        type: String,
        default: null,
      },

      photographerUrl: {
        type: String,
        default: null,
      },
    },

    imageSearchQuery: {
      type: String,
      default: "",
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    dietary: {
      vegetarian: {
        type: Boolean,
        default: true,
      },

      jain: {
        type: Boolean,
        default: false,
      },
    },

    spiceLevel: {
      type: String,
      enum: ["mild", "medium", "spicy", null],
      default: null,
    },

    servingInfo: {
      type: String,
      default: null,
    },

    seasonal: {
      type: Boolean,
      default: false,
    },

    isAddon: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MenuItem",
  menuItemSchema
);