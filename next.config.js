/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production'
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev, // Disable PWA in development to avoid 404 issues
})

const nextConfig = {
  reactStrictMode: true,
}

module.exports = withPWA(nextConfig)
