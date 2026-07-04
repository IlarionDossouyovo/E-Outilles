import Link from 'next/link'

interface LogoProps {
  variant?: 'horizontal' | 'icon' | 'stacked'
  size?: number
  className?: string
}

export default function Logo({ variant = 'horizontal', size = 40, className = "" }: LogoProps) {
  const height = variant === 'horizontal' ? size * 0.4 : size
  const width = variant === 'stacked' ? size * 0.85 : size

  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform group-hover:scale-105"
      >
        {/* Icon */}
        <g transform="translate(10, 10)">
          {/* Circle background */}
          <circle cx="30" cy="30" r="28" fill="#121212" stroke="#FFC400" strokeWidth="1.5"/>
          
          {/* E shape */}
          <path d="M16 45V19H36L42 24V32L36 40H28V47H36L42 54H16V45Z" fill="#FFC400"/>
          
          {/* Lightning bolt */}
          <path d="M40 10L32 26H38L35 42L46 22H39L40 10Z" fill="#FFC400"/>
        </g>
        
        {/* Text - Only show for horizontal variant */}
        {variant === 'horizontal' && (
          <>
            <text x="75" y="40" fontFamily="Arial Black, sans-serif" fontSize="26" fontWeight="900" fill="#FFC400">E-OUTIL</text>
            <text x="75" y="55" fontFamily="Arial, sans-serif" fontSize="9" fill="#FFC400" letterSpacing="3">PAR ELECTRON</text>
          </>
        )}
        
        {variant === 'stacked' && (
          <text x="75" y="75" fontFamily="Arial Black, sans-serif" fontSize="22" fontWeight="900" fill="#FFC400">E-OUTIL</text>
        )}
      </svg>
    </Link>
  )
}
