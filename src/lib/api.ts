import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (config.method?.toLowerCase() === "get" && config.url) {
    const separator = config.url.includes("?") ? "&" : "?";

    config.url = `${config.url}${separator}_t=${Date.now()}`;
  }

  return config;
});

export function getErrorMessage(
  error: unknown,
  fallback = "Terjadi kesalahan"
) {
  if (error && typeof error === "object" && "response" in error) {
    const data = (error as {
      response?: { data?: { message?: string } };
    }).response?.data;

    if (data?.message) return data.message;
  }

  return fallback;
}
