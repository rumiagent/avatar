# Avatar

A frontend-only web application featuring an animated avatar with a conversational chat interface. No backend — all side effects are mocked in the client.

## Tech stack

| Layer      | Choice                                     |
| ---------- | ------------------------------------------ |
| Framework  | React 18 + Vite 6                          |
| Language   | TypeScript (strict)                        |
| Styles     | Tailwind CSS 3 + CSS custom properties     |
| Animation  | Rive (planned — see issue #2)              |
| Linting    | ESLint 9 (flat config) + typescript-eslint |
| Formatting | Prettier 3 + prettier-plugin-tailwindcss   |

## Getting started

```bash
npm install
npm run dev      # starts the Vite dev server at http://localhost:5173
```

## Available scripts

| Script                 | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server with HMR                      |
| `npm run build`        | Type-check and produce a production bundle into `dist/` |
| `npm run preview`      | Serve the production bundle locally                     |
| `npm run lint`         | Run ESLint across the project                           |
| `npm run lint:fix`     | Run ESLint and auto-fix violations                      |
| `npm run format`       | Format all files with Prettier                          |
| `npm run format:check` | Check formatting without writing                        |
| `npm run typecheck`    | Run the TypeScript compiler (no emit)                   |

## Project structure

```
avatar/
├── index.html               # Vite entry HTML
├── vite.config.ts           # Vite + React plugin config, path aliases
├── tailwind.config.js       # Tailwind theme (glow colours, animations)
├── postcss.config.js        # PostCSS for Tailwind + Autoprefixer
├── tsconfig.json            # Project-reference root
├── tsconfig.app.json        # Browser code compiler options
├── tsconfig.node.json       # Build-tool compiler options
├── eslint.config.js         # ESLint flat config
└── src/
    ├── main.tsx             # React root mount
    ├── App.tsx              # Root application component
    ├── styles/
    │   └── index.css        # Tailwind directives + global CSS / component layers
    ├── components/          # Shared React components
    ├── hooks/               # Custom React hooks
    ├── mocks/               # Client-side mock data and service fakes
    └── assets/              # Static assets (images, Rive files, fonts)
```

### Directory conventions

- **`components/`** – Reusable UI building blocks. Co-locate styles in a `Component.module.css` file when Tailwind alone is not expressive enough (e.g. complex keyframe animations).
- **`hooks/`** – Custom React hooks. One hook per file, prefixed with `use`.
- **`mocks/`** – All simulated/fake data and services (conversation engine, TTS mock, etc.). Must never contain real API credentials or backend calls.
- **`assets/`** – Binary and static assets. Imported directly in components; Vite handles URL resolution and hashing.
- **`styles/`** – Global CSS, Tailwind base layer overrides, and reusable CSS component classes (`.glow-ring`, etc.).

## Design system notes

Tailwind's theme extension provides:

- **Glow colours** – `glow-primary`, `glow-secondary`, `glow-accent` (purple/violet palette).
- **Glow shadows** – `shadow-glow`, `shadow-glow-lg` for ambient lighting effects.
- **Animations** – `animate-pulse-glow` (pulsing halo), `animate-fade-in` (entry transition).
- **CSS component classes** – `.glow-ring` and `.glow-ring-lg` in `src/styles/index.css`.

## No backend

This application intentionally has no server. All conversation responses, TTS audio, and other side effects are implemented as client-side mocks in `src/mocks/`.
