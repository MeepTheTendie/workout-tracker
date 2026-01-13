// src/lib/auth.ts
export function useAuth() {
  // Always return a dummy user so the app never blocks you
  return {
    user: {
      uid: 'dev-user-id',
      displayName: 'Developer',
      photoURL: null,
      email: 'dev@gatekeeper.local'
    },
    loading: false
  };
}