/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  // webpack: (config) => {
  //   config.experiments = { ...config.experiments, topLevelAwait: true };
  //   return config;
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      }
    ],
  },
};

module.exports = nextConfig;
