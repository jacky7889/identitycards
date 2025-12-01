/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',        // 👈 enables static HTML export
  images: {
    unoptimized: true,     // 👈 disables Next.js image optimization (needed for static hosting)
  },
};

export default nextConfig;
