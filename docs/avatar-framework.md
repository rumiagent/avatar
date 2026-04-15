# Avatar Animation Framework Decision

**Date:** 2026-04-15  
**Issue:** #2  
**Status:** ✅ Decided — **Rive**

---

## 1. Problem Statement

The avatar component needs to render a stylish, high-fidelity 2-D animated character that can:

- Loop an **idle animation** continuously while the assistant is not speaking.
- Transition to a **speaking state** (including mouth/lip movement) when TTS audio plays.
- Respond to real-time signals (audio amplitude) for expressive lip sync.
- Look great at 60 fps in a browser with a small bundle footprint.

---

## 2. Frameworks Evaluated

### 2.1 Rive (`@rive-app/react-canvas`)

| Attribute                  | Detail                                                                       |
| -------------------------- | ---------------------------------------------------------------------------- |
| Licence                    | MIT (runtime)                                                                |
| npm package                | `@rive-app/react-canvas@4.28.0`                                              |
| Core runtime size          | ~300 KB gzip (WASM + JS, served via CDN)                                     |
| State machine              | ✅ Built-in, first-class                                                     |
| Idle → Speaking transition | ✅ Via state machine triggers/inputs                                         |
| Lip sync                   | ✅ Float inputs map directly to mouth-open amplitude                         |
| Free assets                | ✅ [Rive Community](https://rive.app/community/) — many free character files |
| React integration          | ✅ Official `useRive` hook + `<RiveComponent>`                               |

**How it works:** A `.riv` file bundles the artboard, animations, and state machine. The web app drives the state machine by setting boolean/number inputs (e.g., `isSpeaking`, `mouthOpen`). Transitions between states are interpolated by the Rive runtime — no custom animation code required.

**Spike findings:**

- The React hook (`useRive`) gives synchronous access to `StateMachineInput` objects.
- Audio amplitude from the Web Audio API `AnalyserNode` maps cleanly to a `mouthOpen` float input (0–1).
- The Rive editor (web-based, free) allows creating `.riv` files from scratch, and the community library has suitable starting characters.
- No licence fees; the runtime is MIT.

---

### 2.2 Lottie / dotLottie (`lottie-react` / `@dotlottie/react-player`)

| Attribute                  | Detail                                                                    |
| -------------------------- | ------------------------------------------------------------------------- |
| Licence                    | MIT                                                                       |
| npm (lottie-react)         | `2.4.1` (wraps `lottie-web`)                                              |
| npm (dotLottie)            | `@dotlottie/react-player@1.6.19`                                          |
| Core runtime size          | ~234 KB gzip (lottie-web)                                                 |
| State machine              | ❌ No native state machine; transitions require manual segment management |
| Idle → Speaking transition | ⚠️ Possible by switching animation segments, but awkward                  |
| Lip sync                   | ❌ No built-in; would require frame-scrubbing hacks                       |
| Free assets                | ✅ Large LottieFiles library                                              |

**Spike findings:**

- Lottie is excellent for _playback_ of pre-baked animations exported from AfterEffects.
- Transitioning between idle and speaking states requires manually seeking to different frame ranges or swapping animation instances — there is no state machine concept.
- Lip sync via real-time audio amplitude is not supported; the only option is pre-rendered phoneme animations or scrubbing frames, which produces unnatural results.
- dotLottie adds a slightly smaller binary format and interactive features, but the state machine API remains immature compared to Rive.

**Conclusion:** Lottie is the right tool for marketing animations; it is not the right tool for a reactive, real-time avatar.

---

### 2.3 Spine

| Attribute     | Detail          |
| ------------- | --------------- |
| Licence       | Commercial ($$) |
| State machine | ✅ Full         |
| Lip sync      | ✅ Excellent    |
| Bundle        | ~500 KB+        |

**Conclusion:** Excellent technology but requires a paid Spine Editor licence (starts at $99) and a per-title runtime licence for web. Overkill and cost-prohibitive for this project.

---

### 2.4 CSS / SVG Animation

Pure CSS keyframe animation with an inline SVG character.

**Conclusion:** Achieves simple loops but complex character animation (hair, clothing, realistic mouth shapes) becomes unmaintainable. Lip sync driven by audio amplitude is impractical. Ruled out.

---

### 2.5 Three.js + Ready Player Me (3-D avatar)

A 3-D avatar rendered via WebGL.

**Conclusion:** Heavy bundle (~1 MB+), requires a 3-D aesthetic that conflicts with the target "calm 2-D" art style. Significant implementation complexity. Ruled out.

---

## 3. Decision Matrix

| Criterion                           | Weight | Rive    | Lottie  | Spine   | CSS/SVG |
| ----------------------------------- | ------ | ------- | ------- | ------- | ------- |
| Idle loop                           | 20%    | ✅ 5    | ✅ 5    | ✅ 5    | ✅ 4    |
| Speaking transition (state machine) | 25%    | ✅ 5    | ⚠️ 2    | ✅ 5    | ❌ 1    |
| Real-time lip sync                  | 25%    | ✅ 5    | ❌ 1    | ✅ 5    | ❌ 1    |
| Bundle size                         | 15%    | ✅ 4    | ✅ 5    | ⚠️ 3    | ✅ 5    |
| Free / open assets                  | 10%    | ✅ 5    | ✅ 4    | ⚠️ 2    | ✅ 3    |
| Licence cost                        | 5%     | ✅ 5    | ✅ 5    | ❌ 1    | ✅ 5    |
| **Weighted score**                  |        | **4.8** | **3.1** | **3.9** | **2.6** |

---

## 4. Recommendation: Rive

**Rive is chosen as the avatar animation framework.**

### Rationale

1. **State machine is a first-class citizen.** Idle → speaking transitions are modelled directly in the Rive file, not shimmed in application code. This keeps the React component thin.

2. **Real-time lip sync is natural.** A `mouthOpen` float input driven by `AnalyserNode` data produces believable, responsive mouth movement with zero extra rendering logic.

3. **MIT runtime, free editor.** No licence gate. The Rive web editor is free; `.riv` community files are available under Creative Commons / free tiers.

4. **Small footprint.** The WASM runtime (~300 KB gzip) is comparable to lottie-web and significantly smaller than Three.js or Spine.

5. **Excellent React DX.** The `useRive` hook is idiomatic; `StateMachineInput` objects update reactively and are trivially testable with mocks.

### Caveats

- A `.riv` character file is required. We will source one from the [Rive Community](https://rive.app/community/) (filtering for "character", "avatar", or "woman" with appropriate licence) or commission a simple one. A fallback placeholder animation will be used during development.
- The WASM binary is loaded asynchronously; a `<Suspense>` boundary and loading skeleton must be present.

---

## 5. Integration Plan

```
src/
  components/
    avatar/
      AvatarCanvas.tsx          # Wraps useRive, exposes setIsSpeaking / setMouthOpen
      AvatarCanvas.test.tsx     # Unit tests (mock useRive)
  assets/
    avatar.riv                  # Rive character file (placeholder → final asset)
```

### State machine inputs

| Input name   | Type         | Description                                       |
| ------------ | ------------ | ------------------------------------------------- |
| `isSpeaking` | Boolean      | Triggers idle ↔ speaking state transition         |
| `mouthOpen`  | Number (0–1) | Drives mouth-open blend driven by audio amplitude |

### NPM package added

```
@rive-app/react-canvas  ^4.28.0
```

---

## 6. Alternatives Revisited

Should the chosen `.riv` asset approach become blocked (e.g., no suitable character file found), the fallback plan is a CSS/SVG avatar with a limited set of hand-crafted keyframe animations for idle and speaking states. This fallback is intentionally simpler and would not support real-time lip sync.
