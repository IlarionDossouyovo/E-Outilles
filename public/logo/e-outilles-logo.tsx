// E-Outille Logo - Vector SVG Components
// Horizontal, Stacked, and Icon-only variants

export const LogoIcon = ({ className = "", size = 48 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background circle */}
    <circle cx="60" cy="60" r="58" fill="#121212" stroke="#FFC400" strokeWidth="2"/>
    
    {/* Electric glow effect */}
    <defs>
      <linearGradient id="electricGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFC400" stopOpacity="0.8"/>
        <stop offset="50%" stopColor="#FF8C00" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#FFC400" stopOpacity="0.3"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Stylized E with lightning */}
    <path 
      d="M35 85V35H75L85 45V55L75 65H55V75H75L85 85H35Z" 
      fill="#FFC400"
    />
    {/* Lightning bolt */}
    <path 
      d="M70 25L55 50H65L60 75L80 45H68L70 25Z" 
      fill="#FFC400"
      filter="url(#glow)"
    />
    {/* Tool/Gear element */}
    <circle cx="35" cy="35" r="8" fill="#FFC400" opacity="0.9"/>
    <circle cx="35" cy="35" r="4" fill="#121212"/>
  </svg>
)

export const LogoHorizontal = ({ className = "", size = 200 }) => (
  <svg 
    width={size} 
    height={size * 0.4} 
    viewBox="0 0 200 80" 
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFC400"/>
        <stop offset="100%" stopColor="#FF8C00"/>
      </linearGradient>
    </defs>
    
    {/* Icon */}
    <g transform="translate(5, 5)">
      <circle cx="35" cy="35" r="33" fill="#121212" stroke="#FFC400" strokeWidth="1.5"/>
      <path d="M20 55V25H45L52 32V42L45 50H35V58H45L52 65H20V55Z" fill="url(#yellowGrad)"/>
      <path d="M48 15L38 35H44L40 55L55 30H46L48 15Z" fill="#FFC400"/>
    </g>
    
    {/* Text */}
    <text x="80" y="42" fontFamily="Arial Black, sans-serif" fontSize="28" fontWeight="900" fill="#FFC400">
      E-OUTIL
    </text>
    <text x="80" y="58" fontFamily="Arial, sans-serif" fontSize="10" fill="#FFC400" letterSpacing="4">
      PAR ELECTRON
    </text>
  </svg>
)

export const LogoStacked = ({ className = "", size = 120 }) => (
  <svg 
    width={size} 
    height={size * 1.2} 
    viewBox="0 0 100 120" 
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="yellowGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFC400"/>
        <stop offset="100%" stopColor="#FF8C00"/>
      </linearGradient>
    </defs>
    
    {/* Icon */}
    <circle cx="50" cy="45" r="40" fill="#121212" stroke="#FFC400" strokeWidth="2"/>
    <path d="M30 65V25H55L65 35V45L55 55H40V65H55L65 75H30V65Z" fill="url(#yellowGrad2)"/>
    <path d="M58 10L45 35H55L50 60L70 30H58L58 10Z" fill="#FFC400"/>
    
    {/* Text */}
    <text x="50" y="105" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="22" fontWeight="900" fill="#FFC400">
      E-OUTIL
    </text>
  </svg>
)

export const LogoFavicon = ({ className = "" }) => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 32 32" 
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="6" fill="#121212"/>
    <path d="M8 22V10H16L19 13V16L16 19H12V22H16L19 25H8V22Z" fill="#FFC400"/>
    <path d="M18 6L14 13H16L14 19L20 11H17L18 6Z" fill="#FFC400"/>
  </svg>
)

export const LogoLight = ({ className = "", size = 200 }) => (
  <svg 
    width={size} 
    height={size * 0.4} 
    viewBox="0 0 200 80" 
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Light mode - white background, black text */}
    <g>
      <circle cx="35" cy="40" r="30" fill="#FFC400"/>
      <path d="M20 55V25H45L52 32V42L45 50H35V58H45L52 65H20V55Z" fill="#121212"/>
      <path d="M48 15L38 35H44L40 55L55 30H46L48 15Z" fill="#121212"/>
    </g>
    
    <text x="80" y="42" fontFamily="Arial Black, sans-serif" fontSize="28" fontWeight="900" fill="#121212">
      E-OUTIL
    </text>
    <text x="80" y="58" fontFamily="Arial, sans-serif" fontSize="10" fill="#121212" letterSpacing="4">
      PAR ELECTRON
    </text>
  </svg>
)
