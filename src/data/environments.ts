/**
 * Environment definitions — each describes a background "room" the user can pick.
 *
 * Because we cannot bundle large photo assets in the repo, every environment
 * is rendered with layered CSS gradients that evoke the intended mood.
 * The gradients are designed to stay dark enough that the avatar and chat
 * text remain comfortably readable at all times.
 */

export interface Environment {
  /** Unique machine-readable key persisted to localStorage. */
  id: string
  /** Human-readable label shown in the switcher UI. */
  label: string
  /** Short description of the vibe. */
  description: string
  /**
   * CSS `background` shorthand applied to the backdrop layer.
   * Multiple gradient layers are combined for depth.
   */
  background: string
  /** Small CSS gradient used as a thumbnail preview in the switcher. */
  thumbnail: string
}

export const environments: Environment[] = [
  {
    id: 'apartment',
    label: 'Apartment',
    description: 'Cozy Scandinavian living room with warm indirect lighting',
    background: [
      'radial-gradient(ellipse 120% 80% at 20% 80%, rgba(180,130,70,0.18) 0%, transparent 60%)',
      'radial-gradient(ellipse 80% 60% at 80% 20%, rgba(167,139,250,0.08) 0%, transparent 50%)',
      'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(120,80,40,0.12) 0%, transparent 70%)',
      'linear-gradient(175deg, #0f0e14 0%, #15120e 40%, #0d0b08 100%)',
    ].join(', '),
    thumbnail: [
      'radial-gradient(ellipse at 30% 70%, rgba(180,130,70,0.35) 0%, transparent 60%)',
      'linear-gradient(175deg, #0f0e14 0%, #15120e 40%, #0d0b08 100%)',
    ].join(', '),
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    description: 'High-end minimal kitchen with marble and ambient light',
    background: [
      'radial-gradient(ellipse 90% 60% at 50% 30%, rgba(220,220,230,0.07) 0%, transparent 60%)',
      'radial-gradient(ellipse 60% 80% at 70% 70%, rgba(167,139,250,0.06) 0%, transparent 50%)',
      'linear-gradient(180deg, #0e0e12 0%, #111118 35%, #0a0a10 100%)',
    ].join(', '),
    thumbnail: [
      'radial-gradient(ellipse at 50% 40%, rgba(220,220,230,0.15) 0%, transparent 60%)',
      'linear-gradient(180deg, #0e0e12 0%, #111118 35%, #0a0a10 100%)',
    ].join(', '),
  },
  {
    id: 'evening-lounge',
    label: 'Evening Lounge',
    description: 'Dimly lit upscale bar with moody blue tones',
    background: [
      'radial-gradient(ellipse 100% 70% at 30% 60%, rgba(60,80,160,0.16) 0%, transparent 60%)',
      'radial-gradient(ellipse 70% 50% at 80% 30%, rgba(100,60,180,0.10) 0%, transparent 50%)',
      'radial-gradient(ellipse 120% 80% at 50% 100%, rgba(30,30,80,0.18) 0%, transparent 60%)',
      'linear-gradient(170deg, #08081a 0%, #0c0c20 40%, #060612 100%)',
    ].join(', '),
    thumbnail: [
      'radial-gradient(ellipse at 40% 50%, rgba(60,80,160,0.30) 0%, transparent 60%)',
      'linear-gradient(170deg, #08081a 0%, #0c0c20 40%, #060612 100%)',
    ].join(', '),
  },
  {
    id: 'garden',
    label: 'Garden',
    description: 'Soft daylight with blurred foliage and an airy feel',
    background: [
      'radial-gradient(ellipse 110% 80% at 40% 20%, rgba(80,140,80,0.12) 0%, transparent 60%)',
      'radial-gradient(ellipse 80% 70% at 70% 70%, rgba(100,160,80,0.08) 0%, transparent 50%)',
      'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(200,200,160,0.06) 0%, transparent 50%)',
      'linear-gradient(175deg, #0b0e0b 0%, #0e120e 40%, #090c09 100%)',
    ].join(', '),
    thumbnail: [
      'radial-gradient(ellipse at 50% 30%, rgba(80,140,80,0.25) 0%, transparent 60%)',
      'linear-gradient(175deg, #0b0e0b 0%, #0e120e 40%, #090c09 100%)',
    ].join(', '),
  },
]

export const DEFAULT_ENVIRONMENT_ID = 'apartment'

/** Look up an environment by id, falling back to the default. */
export const getEnvironmentById = (id: string): Environment =>
  environments.find((e) => e.id === id) ?? environments[0]
