/**
 * EnvironmentSwitcher — compact popover for choosing the background environment.
 *
 * - A small gear-like icon button sits in the top-right corner.
 * - Clicking it opens a popover listing each environment with a thumbnail,
 *   label, and description.  The active environment is highlighted.
 * - The popover is dismissable via clicking outside, pressing Escape,
 *   or selecting an environment.
 * - Fully keyboard-accessible (Tab, Enter/Space, Escape).
 */

import { useCallback, useEffect, useRef, useState } from 'react'

import type { Environment } from '@/data/environments'
import { environments } from '@/data/environments'

export interface EnvironmentSwitcherProps {
  activeId: string
  onSelect: (id: string) => void
}

export const EnvironmentSwitcher: React.FC<EnvironmentSwitcherProps> = ({
  activeId,
  onSelect,
}) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const toggle = useCallback(() => setOpen((v) => !v), [])
  const close = useCallback(() => setOpen(false), [])

  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id)
      setOpen(false)
    },
    [onSelect],
  )

  /* Close on outside click */
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, close])

  /* Close on Escape */
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, close])

  return (
    <div ref={containerRef} className="fixed right-4 top-4 z-50" data-testid="env-switcher">
      {/* Toggle button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label="Switch background environment"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={[
          'flex h-9 w-9 items-center justify-center rounded-full',
          'border border-surface-border bg-surface-overlay/80 backdrop-blur-sm',
          'text-white/60 transition-all duration-200',
          'hover:border-glow-primary/40 hover:text-white/90 hover:shadow-glow/20',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow-primary/50',
          open ? 'border-glow-primary/40 text-white/90' : '',
        ].join(' ')}
      >
        {/* Simple settings/grid icon (SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4.5 w-4.5"
          aria-hidden="true"
        >
          <path d="M3 4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4Zm9 0a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V4ZM3 13a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3Zm9 0a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-3Z" />
        </svg>
      </button>

      {/* Popover */}
      {open && (
        <div
          role="listbox"
          aria-label="Background environments"
          className={[
            'absolute right-0 top-11 w-64',
            'rounded-xl border border-surface-border bg-surface-overlay/95 backdrop-blur-md',
            'shadow-lg shadow-black/40',
            'animate-fade-in',
            'p-2',
          ].join(' ')}
        >
          <p className="mb-2 px-2 text-label-sm font-medium uppercase tracking-widest text-white/40">
            Environment
          </p>
          {environments.map((env) => (
            <EnvironmentOption
              key={env.id}
              env={env}
              isActive={env.id === activeId}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Individual option ──────────────────────────────────────────────────── */

interface EnvironmentOptionProps {
  env: Environment
  isActive: boolean
  onSelect: (id: string) => void
}

const EnvironmentOption: React.FC<EnvironmentOptionProps> = ({ env, isActive, onSelect }) => {
  const handleClick = () => onSelect(env.id)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(env.id)
    }
  }

  return (
    <div
      role="option"
      aria-selected={isActive}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={[
        'flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2',
        'transition-colors duration-150',
        isActive
          ? 'bg-glow-primary/10 ring-1 ring-glow-primary/30'
          : 'hover:bg-surface-muted/60',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow-primary/50',
      ].join(' ')}
    >
      {/* Thumbnail */}
      <div
        className="h-10 w-10 flex-shrink-0 rounded-lg border border-surface-border"
        style={{ background: env.thumbnail }}
        aria-hidden="true"
      />
      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white/90">{env.label}</p>
        <p className="truncate text-xs text-white/40">{env.description}</p>
      </div>
      {/* Active indicator */}
      {isActive && (
        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-glow-primary" aria-hidden="true" />
      )}
    </div>
  )
}
