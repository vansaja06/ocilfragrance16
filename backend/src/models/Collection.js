import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const CollectionSchema = new Schema(
  {
    leftProduct: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    topRightProduct: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    bottomLeftProduct: {
      type: Schema.Types.ObjectId,
      ref: "Product",
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

export default models.Collection || model("Collection", CollectionSchema);
