import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "192.168.1.162",
    "192.168.100.8",
  ],
};

export default nextConfig;
