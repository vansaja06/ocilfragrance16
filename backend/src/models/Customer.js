import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const CustomerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Customer || model("Customer", CustomerSchema);
