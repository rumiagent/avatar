/**
 * Stories for BackgroundLayer.
 *
 * Note: Storybook is not yet configured in the project (see issue #18).
 * These stories follow the standard CSF3 format and will work once
 * Storybook is added.
 */

import { useState } from 'react'

import { BackgroundLayer } from './BackgroundLayer'
import { environments } from '@/data/environments'

export default {
  title: 'Organisms/BackgroundLayer',
  component: BackgroundLayer,
}

export const Apartment = () => <BackgroundLayer environment={environments[0]} />

export const Kitchen = () => <BackgroundLayer environment={environments[1]} />

export const EveningLounge = () => <BackgroundLayer environment={environments[2]} />

export const Garden = () => <BackgroundLayer environment={environments[3]} />

/** Demonstrates the crossfade transition when toggling environments. */
export const CrossfadeDemo = () => {
  const [index, setIndex] = useState(0)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <BackgroundLayer environment={environments[index]} />
      <div style={{ position: 'relative', zIndex: 10, padding: 24 }}>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % environments.length)}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: 'rgba(167,139,250,0.2)',
            border: '1px solid rgba(167,139,250,0.4)',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Next environment ({environments[index].label})
        </button>
      </div>
    </div>
  )
}
