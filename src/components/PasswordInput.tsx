'use client'

import { useState } from 'react'

interface PasswordInputProps {
  name?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  autoComplete?: string
  className?: string
  label?: string
}

// Password field with a show/hide toggle (eye icon).
export default function PasswordInput({
  name = 'password',
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  className = '',
  label,
}: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div>
      {label && <label className="text-gray-400 text-sm mb-2 block">{label}</label>}
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          defaultValue={onChange ? undefined : value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full bg-ingco-dark border border-ingco-dark rounded-xl px-4 py-3 pr-12 text-white focus:border-ingco-yellow focus:outline-none ${className}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          title={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ingco-yellow transition-colors"
        >
          {show ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 5.09A9.77 9.77 0 0112 5c5 0 9 4.5 9 7 0 .98-.5 2.05-1.36 3.09M6.1 6.1C3.8 7.5 3 9.4 3 12c0 2.5 4 7 9 7 1.3 0 2.5-.3 3.6-.8" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
              <circle cx="12" cy="12" r="3" strokeWidth={2} />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
