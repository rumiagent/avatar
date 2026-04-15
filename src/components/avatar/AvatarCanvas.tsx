/**
 * AvatarCanvas – wraps the Rive runtime to render the animated avatar character.
 *
 * State machine inputs (defined in the .riv file):
 *   - `isSpeaking`  (Boolean) – triggers idle ↔ speaking state transition
 *   - `mouthOpen`   (Number 0-1) – drives mouth-open blend from audio amplitude
 *
 * Usage:
 *   const avatarRef = useRef<AvatarHandle>(null);
 *   <AvatarCanvas ref={avatarRef} src="/avatar.riv" stateMachine="AvatarSM" />
 *   avatarRef.current?.setIsSpeaking(true);
 *   avatarRef.current?.setMouthOpen(0.7);
 */

import { forwardRef, useImperativeHandle } from 'react'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'

export interface AvatarHandle {
  /** Toggle the speaking state transition in the Rive state machine. */
  setIsSpeaking: (value: boolean) => void
  /** Set the mouth-open amplitude (0 = closed, 1 = fully open). */
  setMouthOpen: (value: number) => void
}

export interface AvatarCanvasProps {
  /** Path or URL to the .riv file. */
  src: string
  /** Name of the state machine artboard in the .riv file. */
  stateMachine: string
  /** Optional CSS class applied to the canvas wrapper. */
  className?: string
  /** Accessible label for screen readers. */
  ariaLabel?: string
}

const AvatarCanvas = forwardRef<AvatarHandle, AvatarCanvasProps>(
  ({ src, stateMachine, className = '', ariaLabel = 'Animated avatar' }, ref) => {
    const { rive, RiveComponent } = useRive({
      src,
      stateMachines: stateMachine,
      autoplay: true,
    })

    const isSpeakingInput = useStateMachineInput(rive, stateMachine, 'isSpeaking')
    const mouthOpenInput = useStateMachineInput(rive, stateMachine, 'mouthOpen')

    useImperativeHandle(ref, () => ({
      setIsSpeaking(value: boolean) {
        if (isSpeakingInput) {
          isSpeakingInput.value = value
        }
      },
      setMouthOpen(value: number) {
        if (mouthOpenInput) {
          mouthOpenInput.value = Math.max(0, Math.min(1, value))
        }
      },
    }))

    return (
      <div className={`relative overflow-hidden ${className}`} role="img" aria-label={ariaLabel}>
        <RiveComponent />
      </div>
    )
  },
)

AvatarCanvas.displayName = 'AvatarCanvas'

export default AvatarCanvas
