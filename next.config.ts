const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hcphotos1.deployor.dev",
      },
    ],
  },
  experimental: {
    // Uploads (PNG bytes) are sent through Server Actions; the default is 1 MB.
    // Keep this comfortably above our 5 MB validation limit.
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
} satisfies import("next").NextConfig;

export default nextConfig;
