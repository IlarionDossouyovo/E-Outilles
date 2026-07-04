// Script to generate placeholder SVG images for blog posts
const fs = require('fs');

const blogs = [
  { name: 'marteau-perforateur', title: 'Choisir marteau perforateur', color: '#e74c3c' },
  { name: 'securite-electrique', title: 'Sécurité électrique', color: '#f1c40f' },
  { name: 'kit-cles', title: 'Guide kit de clés', color: '#3498db' },
  { name: 'jardin-printemps', title: 'Entretien jardin printemps', color: '#27ae60' },
  { name: 'location-outils', title: 'Location d\'outils', color: '#9b59b6' },
  { name: 'maintenance-outils', title: 'Maintenance préventive', color: '#e67e22' },
  { name: 'livraison', title: 'Guide livraison', color: '#1abc9c' },
  { name: 'formation', title: 'Formation outils', color: '#34495e' },
  { name: 'consultation', title: 'Consultation technique', color: '#c0392b' },
];

const svgTemplate = (color, title) => `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <rect fill="#0f0f23" width="800" height="400"/>
  <rect fill="${color}" x="0" y="0" width="800" height="300" rx="0"/>
  <rect fill="#fff" opacity="0.1" x="50" y="50" width="700" height="200" rx="10"/>
  <circle fill="#fff" opacity="0.2" cx="400" cy="150" r="80"/>
  <circle fill="#0f0f23" opacity="0.3" cx="400" cy="150" r="40"/>
  <rect fill="#0f0f23" x="0" y="300" width="800" height="100"/>
  <text fill="#fff" x="400" y="360" font-family="Arial" font-size="24" text-anchor="middle" font-weight="bold">${title}</text>
  <text fill="${color}" x="400" y="385" font-family="Arial" font-size="14" text-anchor="middle">Blog E-Outilles</text>
</svg>`;

blogs.forEach(b => {
  fs.writeFileSync(`${b.name}.svg`, svgTemplate(b.color, b.title));
  console.log(`Created: ${b.name}.svg`);
});

console.log('All blog images generated!');
