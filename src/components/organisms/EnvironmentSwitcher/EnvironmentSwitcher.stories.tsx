/**
 * Stories for EnvironmentSwitcher.
 *
 * Note: Storybook is not yet configured in the project (see issue #18).
 * These stories follow the standard CSF3 format and will work once
 * Storybook is added.
 */

import { useState } from 'react'

import { EnvironmentSwitcher } from './EnvironmentSwitcher'

export default {
  title: 'Organisms/EnvironmentSwitcher',
  component: EnvironmentSwitcher,
  decorators: [
    (Story: React.FC) => (
      <div style={{ background: '#09090f', minHeight: '100vh', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
}

export const Default = () => {
  const [activeId, setActiveId] = useState('apartment')
  return <EnvironmentSwitcher activeId={activeId} onSelect={setActiveId} />
}

export const KitchenSelected = () => {
  const [activeId, setActiveId] = useState('kitchen')
  return <EnvironmentSwitcher activeId={activeId} onSelect={setActiveId} />
}

export const EveningLoungeSelected = () => {
  const [activeId, setActiveId] = useState('evening-lounge')
  return <EnvironmentSwitcher activeId={activeId} onSelect={setActiveId} />
}
