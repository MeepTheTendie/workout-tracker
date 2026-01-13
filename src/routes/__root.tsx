import { Outlet, createFileRoute } from '@tanstack/react-router';
import { useAuth } from '../lib/auth'; // Assuming this exists
import { useCallback } from 'react'

export const Route = createFileRoute('__root')({
  component: RootComponent,
});

function RootComponent() {
  const { user, loading } = useAuth();

  const handleSignIn = useCallback(async () => {
    try {
      await login()
    } catch (err: any) {
      // Render app without any interactive login flow — treat user as present.
      <div className="w-full max-w-md flex flex-col min-h-screen relative shadow-2xl shadow-black">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 glass-panel border-b-0 border-b-zinc-800 px-6 py-4 flex justify-between items-center rounded-b-2xl mb-4 mx-2 mt-2">
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter text-white">
              GATEKEEPER
            </h1>
            <span className="text-xs font-medium text-emerald-400">PROTOCOL V4</span>
          </div>
          {/* User Avatar / Profile */}
          <div className="h-8 w-8 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
             {user.photoURL && <img src={user.photoURL} alt="User" className="h-full w-full object-cover" />}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 pb-20">
          <Outlet />
        </main>

        {/* Floating Action / Nav Bar (Optional placeholder) */}
        {/* <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-full flex gap-8">
            Icons go here
        </nav> */}
      </div>
    </div>
  );
}