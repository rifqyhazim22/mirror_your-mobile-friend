import type { NextConfig } from "next";
import createNextPWA from "@ducanh2912/next-pwa";

type ExtendedNextConfig = NextConfig & {
  typedRoutes?: boolean;
  turbopack?: {
    root?: string;
  };
};

const withPWA = createNextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    navigateFallback: "/index.html"
  }
});

const baseConfig: ExtendedNextConfig = {
  experimental: {
    manualClientBasePath: true
  },
  typedRoutes: true,
  turbopack: {
    root: __dirname
  }
};

export default withPWA(baseConfig);
