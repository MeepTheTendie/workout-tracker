// src/lib/auth.ts
import { useState, useEffect } from 'react';

export function useAuth() {
  // Always return a dummy user so the app never blocks you
  return {
    user: {
      uid: 'dev-user-id',
      displayName: 'Developer',
      photoURL: null, // or put a placeholder image URL here
      email: 'dev@gatekeeper.local'
    },
    loading: false // Never stuck loading
  };
}