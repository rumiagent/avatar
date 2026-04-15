/**
 * Stories for AvatarCanvas – Rive animation runtime wrapper.
 *
 * AvatarCanvas requires a .riv file and the Rive runtime. Since the .riv
 * asset may not be available in the Storybook environment, these stories
 * demonstrate the component in a graceful-degradation scenario and document
 * the expected API surface.
 *
 * When a valid .riv file is placed at /avatar.riv in the public directory,
 * the Default story will render the animated canvas.
 */

import AvatarCanvas from './AvatarCanvas'

export default {
  title: 'Organisms/AvatarCanvas',
  component: AvatarCanvas,
  decorators: [
    (Story: React.FC) => (
      <div
        style={{
          background: '#09090f',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

/**
 * Default — attempts to load a .riv file from /avatar.riv.
 * If the file does not exist the Rive runtime will log an error but
 * the component wrapper remains visible.
 */
export const Default = () => (
  <AvatarCanvas
    src="/avatar.riv"
    stateMachine="AvatarSM"
    className="h-[50vh] w-[50vh]"
  />
)

/** With a custom aria label for accessibility testing. */
export const WithAriaLabel = () => (
  <AvatarCanvas
    src="/avatar.riv"
    stateMachine="AvatarSM"
    className="h-[50vh] w-[50vh]"
    ariaLabel="Custom animated avatar canvas"
  />
)

/** Small size — verifying the component scales down correctly. */
export const SmallSize = () => (
  <AvatarCanvas
    src="/avatar.riv"
    stateMachine="AvatarSM"
    className="h-32 w-32"
  />
)
