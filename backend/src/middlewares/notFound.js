// Middleware untuk menangani request ke route yang tidak ada (404 Not Found)
export default function notFound(req, res) {
  res.status(404).json({ message: "Route not found" });
}
