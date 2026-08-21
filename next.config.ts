import type { NextConfig } from "next";
import path from "path";
import os from "os";

function getLocalIP(): string {
  for (const iface of Object.values(os.networkInterfaces())) {
    for (const info of iface ?? []) {
      if (info.family === "IPv4" && !info.internal && !info.address.startsWith("169.254.")) {
        return info.address;
      }
    }
  }
  return "localhost";
}

const DEV_HOST = getLocalIP();
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", DEV_HOST],
  turbopack: {
    root: path.join(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;