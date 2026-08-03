import { connectDB } from "../config/database.js";

export default class HealthController {
  testDb = async (req, res) => {
    try {
      await connectDB();

      res.json({ success: true, message: "MongoDB Connected!" });
    } catch (error) {
      this.#handleError(res, error);
    }
  };

  #handleError(res, error) {
    console.error(error);

    res
      .status(500)
      .json({ success: false, message: "Failed to connect database" });
  }
}
