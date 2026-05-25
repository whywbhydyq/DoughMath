/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 20,
  experimental: { cpus: 1 }
};
export default nextConfig;
