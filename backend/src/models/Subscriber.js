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
