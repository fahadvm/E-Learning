import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // fastRefresh: false,
  images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**",
    },
  ],
}

};

export default nextConfig;
