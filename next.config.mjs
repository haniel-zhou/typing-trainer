/** @type {import('next').NextConfig} */
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

const nextConfig = {
  // Vercel expects the default `.next` output directory during deployment.
  distDir: isVercel ? ".next" : process.env.NEXT_DIST_DIR || ".next"
};
export default nextConfig;
