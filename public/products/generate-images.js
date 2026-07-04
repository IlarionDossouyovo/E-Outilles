// Script to generate placeholder SVG images for products
const fs = require('fs');

const products = [
  // Construction
  { name: 'meuleuse-230', label: 'Meuleuse 230V - 2200W', color: '#e74c3c' },
  { name: 'scie-circulaire', label: 'Scie circulaire - 1900W', color: '#e67e22' },
  { name: 'escabeau', label: 'Escabeau 8 marches', color: '#95a5a6' },
  { name: 'disqueuse-pneu', label: 'Disqueuse pneumatique', color: '#7f8c8d' },
  { name: 'burins-sds', label: 'Coffret burins SDS-Plus', color: '#34495e' },
  { name: 'marteau-perforateur', label: 'Marteau perforateur SDS-Max', color: '#c0392b' },
  { name: 'perceuse-visseuse', label: 'Perceuse visseuse 20V', color: '#2980b9' },
  { name: 'niveau-laser', label: 'Niveau laser automatique', color: '#16a085' },
  
  // Electricité
  { name: 'multimetre', label: 'Multimètre True-RMS', color: '#f1c40f' },
  { name: 'pince-sertir', label: 'Pince à sertir hydraulique', color: '#f39c12' },
  { name: 'testeur-ncv', label: 'Testeur tension NCV', color: '#e67e22' },
  { name: 'pince-amp', label: 'Pince ampèremétrique', color: '#d35400' },
  { name: 'cables-test', label: 'Câbles testerman', color: '#c0392b' },
  { name: 'lampe-led', label: 'Lampe torche LED', color: '#9b59b6' },
  { name: 'tournevis-isole', label: 'Tournevis isolé 1000V', color: '#e74c3c' },
  { name: 'pince-denudeuse', label: 'Pince dénudeuse auto', color: '#3498db' },
  
  // Garage
  { name: 'cric-rouleur', label: 'Cric rouleur 3T', color: '#3498db' },
  { name: 'presse-hydraulique', label: 'Presse hydraulique 20T', color: '#2980b9' },
  { name: 'demonte-valve', label: 'Démonte-valve pneumatique', color: '#95a5a6' },
  { name: 'extracteur', label: 'Extracteur roulements', color: '#7f8c8d' },
  { name: 'cales', label: 'Cales épaisseur 24 pièces', color: '#bdc3c7' },
  { name: 'chandelles', label: 'Chandelles sécurité 3T', color: '#e74c3c' },
  { name: 'cle-chocs', label: 'Clé à chocs 1/2"', color: '#f39c12' },
  { name: 'kit-cles', label: 'Kit clés 40 pièces', color: '#e67e22' },
  
  // Jardinage
  { name: 'tondeuse', label: 'Tondeuse thermique 45cm', color: '#27ae60' },
  { name: 'tronconneuse', label: 'Tronçonneuse 50cm', color: '#e74c3c' },
  { name: 'taille-haie', label: 'Taille-haie électrique', color: '#2ecc71' },
  { name: 'souffleur', label: 'Souffleur feuilles 2 temps', color: '#f39c12' },
  { name: 'motoculteur', label: 'Motoculteur 7CV', color: '#27ae60' },
  { name: 'pulverisateur', label: 'Pulvérisateur 12L', color: '#3498db' },
  { name: 'secateur', label: 'Sécateur électrique', color: '#2ecc71' },
  { name: 'scie-jardin', label: 'Scie précision 52V', color: '#16a085' },
];

const svgTemplate = (color, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect fill="#1a1a2e" width="400" height="300"/>
  <rect fill="${color}" x="50" y="50" width="300" height="200" rx="20"/>
  <rect fill="#fff" opacity="0.2" x="70" y="70" width="260" height="160" rx="10"/>
  <circle fill="#fff" opacity="0.3" cx="200" cy="150" r="60"/>
  <circle fill="#1a1a2e" opacity="0.5" cx="200" cy="150" r="30"/>
  <text fill="#fff" x="200" y="285" font-family="Arial" font-size="14" text-anchor="middle" font-weight="bold">${label}</text>
</svg>`;

products.forEach(p => {
  fs.writeFileSync(`${p.name}.svg`, svgTemplate(p.color, p.label));
  console.log(`Created: ${p.name}.svg`);
});

console.log('All images generated!');
