import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const BannerSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    subtitle: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    button: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Banner || model("Banner", BannerSchema);
