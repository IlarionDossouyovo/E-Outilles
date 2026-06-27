/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false, // Enable PWA in development
})

const nextConfig = {
  reactStrictMode: true,
}

module.exports = withPWA(nextConfig)
