import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      sparse: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    image: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    sold: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    sizes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default models.Product || model("Product", ProductSchema);
