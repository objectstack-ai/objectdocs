import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.next',
  images: { unoptimized: true },
  transpilePackages: ['lucide-react'],
};

export default withMDX(nextConfig);
