import ApiError from "../utils/ApiError.js";

export default function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.toResponseBody());
  }

  console.error(err);

  return res.status(500).json({ message: "Server Error" });
}
