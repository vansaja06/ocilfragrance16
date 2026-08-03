import mongoose from "mongoose";
import config from "./index.js";

let cachedConnection = null;

export async function connectDB() {
  if (cachedConnection) return cachedConnection;

  cachedConnection = await mongoose.connect(config.mongodbUri);

  return cachedConnection;
}

export async function disconnectDB() {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
  }
}
