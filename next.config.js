/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

// Disable PWA completely for now - causing issues in dev
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
// })

module.exports = nextConfig
