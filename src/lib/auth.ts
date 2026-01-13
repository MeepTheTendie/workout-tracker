// Simplified auth hook for environments where auth is intentionally removed.
// Returns a stable local user so UI behaves as authenticated.
export function useAuth() {
  const user = {
    uid: 'local',
    displayName: 'Local',
    photoURL: undefined,
  } as any

  const loading = false

  return { user, loading }
}