import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const SubscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    payment: {
      type: String,
      default: "",
    },

    paymentProof: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Menunggu", "Disetujui", "Ditolak", "Berhenti"],
      default: "Menunggu",
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    source: {
      type: String,
      default: "home",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Subscriber || model("Subscriber", SubscriberSchema);
