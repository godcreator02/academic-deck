import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  redirects: async () => [
    { source: '/', destination: '/docs', permanent: true },
    { source: '/docs/components/skill', destination: '/docs/plugin/skill', permanent: true },
    { source: '/docs/components/references/:page', destination: '/docs/plugin/references/:page', permanent: true },
  ],
};

export default withMDX(config);
