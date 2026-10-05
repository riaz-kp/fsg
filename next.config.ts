import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Browsers ask for /favicon.ico regardless of the <link rel="icon">; serve them the PNG icon.
  async rewrites() {
    return [{ source: '/favicon.ico', destination: '/icon.png' }]
  },
}

export default nextConfig
