// Mengimpor class ApiError untuk mengecek tipe error
import ApiError from "../utils/ApiError.js";

// Middleware penanganan error global (signature: 4 parameter agar Express mengenalinya sebagai error handler)
export default function errorHandler(err, req, res, next) {
  // Jika error adalah instance ApiError, kirim response sesuai statusCode yang sudah ditentukan
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.toResponseBody());
  }

  // Log error ke console untuk debugging
  console.error(err);

  // Jika bukan ApiError, kirim response 500 Internal Server Error
  return res.status(500).json({ message: "Server Error" });
}
