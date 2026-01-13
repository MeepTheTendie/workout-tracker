// Minimal route type shim to satisfy build-time type checks when generated
// route types are not present (e.g., CI environments).
// This is intended as a short-term safety net — prefer generating
// `routeTree.gen.ts` or a more specific declaration long-term.

declare global {
  interface FileRoutesByPath {
    [path: string]: any
  }
}

export {}
