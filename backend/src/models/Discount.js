import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const DiscountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: null,
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

export default models.Discount || model("Discount", DiscountSchema);
