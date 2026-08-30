import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const LimitedOfferSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    label: {
      type: String,
      default: "Limited Offer",
    },

    discountText: {
      type: String,
      default: "30%",
    },

    description: {
      type: String,
      default: "Discount For Selected Perfumes",
    },

    buttonText: {
      type: String,
      default: "Shop Now",
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

export default models.LimitedOffer || model("LimitedOffer", LimitedOfferSchema);
