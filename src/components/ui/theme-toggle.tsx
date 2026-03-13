"use client"

import BB8Toggle from "@/components/ui/star-wars-toggle-switch"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  return (
    <div className={`${className ?? ''} inline-flex items-center justify-center`} style={{ width: '68px', height: '36px', overflow: 'visible' }}>
      <div style={{ transform: 'scale(0.35)', transformOrigin: 'center' }}>
        <BB8Toggle />
      </div>
    </div>
  )
}
