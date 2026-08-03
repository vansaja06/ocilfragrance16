import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const OrderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    name: {
      type: String,
      required: true,
    },

    qty: {
      type: Number,
      required: true,
      default: 1,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const OrderSchema = new Schema(
  {
    invoice: {
      type: String,
      required: true,
      unique: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    customerEmail: {
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

    items: {
      type: [OrderItemSchema],
      default: [],
    },

    total: {
      type: Number,
      required: true,
      default: 0,
    },

    payment: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Menunggu", "Diproses", "Selesai", "Dibatalkan"],
      default: "Menunggu",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Order || model("Order", OrderSchema);
