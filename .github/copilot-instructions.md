<!-- .github/copilot-instructions.md - guidance for AI coding agents -->

# Workout Tracker — Copilot Instructions

Purpose: give concise, actionable guidance for an AI coding agent to be productive in this codebase.

- **Quick start (commands)**
  - Install and run dev server: `npm install` then `npm run dev` (Vite HMR).
  - Build for production: `npm run build` (runs `tsc -b && vite build`).
  - Preview production build: `npm run preview`.
  - Lint: `npm run lint` (ESLint).

- **Big picture / architecture**
  - Frontend-only single-page app built with React + TypeScript + Vite.
  - Client-side routing: TanStack Router (see [src/routes/index.tsx](src/routes/index.tsx)).
  - Remote data: Firebase Firestore + Auth using the Web SDK (see [src/lib/firebase.ts](src/lib/firebase.ts)).
  - Client-side cache & server-sync: TanStack React Query is used alongside Firestore snapshots (see [src/lib/queries.ts](src/lib/queries.ts)).
  - Data shapes are defined in [src/lib/types.ts](src/lib/types.ts).

- **Key code patterns to follow**
  - Real-time listeners: `useEntries` / `useTemplates` use `onSnapshot` to populate local state — prefer editing the hook logic when changing list behaviors ([src/lib/queries.ts](src/lib/queries.ts)).
  - Mutations: use `useMutation` and call `queryClient.invalidateQueries({ queryKey: [...] })` on success (see `useAddEntry`, `useAddTemplate`).
  - Firestore helpers: central helper functions live in [src/lib/firebase.ts](src/lib/firebase.ts) (add/delete wrappers and collections). Update these helpers when changing backend collection names.
  - Types-first: update [src/lib/types.ts](src/lib/types.ts) when adding new fields to entries/templates; most components expect these shapes.

- **Environment / integration notes**
  - Firebase configuration comes from Vite env variables: `VITE_FIREBASE_*` (see [src/lib/firebase.ts](src/lib/firebase.ts)).
  - Offline persistence is enabled via IndexedDB; Firestore snapshot logic should handle empty or stale states gracefully.
  - `firebase-admin` is present as a dev dependency — likely used for server tasks; no server code in this repo by default.

- **Where to make common changes**
  - Add new UI pages/routes: modify files under [src/routes](src/routes) and register routes in the route tree generator ([routeTree.gen.ts](routeTree.gen.ts)).
  - Add data fields: update [src/lib/types.ts], adjust Firestore reads/writes in [src/lib/firebase.ts], and update queries/hooks in [src/lib/queries.ts].
  - Share UI components: see [src/components](src/components) for examples (`ExerciseCard.tsx`, `HistoryItem.tsx`).

- **Dev and debugging tips**
  - For layout/routing bugs inspect `App.tsx` and the route files under [src/routes](src/routes).
  - When Firestore data doesn't appear locally, check env vars and browser console for `Persistence error:` logs from `enableIndexedDbPersistence`.
  - Use the browser devtools network tab to observe real-time Firestore websocket activity when debugging sync issues.

- **Conventions & expectations**
  - Keep TypeScript types authoritative: prefer updating `types.ts` before mass-changing components.
  - State derived from Firestore should be treated as read-only; mutations go through helpers in `src/lib/firebase.ts`.
  - Follow existing ESLint rules; run `npm run lint` before publishing changes.

If anything is unclear or you want the file to include more examples (for instance, a short walkthrough of adding a new entry type), tell me what to add and I'll iterate.
