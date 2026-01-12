import { Outlet, createFileRoute } from '@tanstack/react-router';
import { useAuth } from '../lib/auth'; // Assuming this exists
import { login } from '../lib/firebase';

export const Route: any = createFileRoute('__root' as any)({
  component: RootComponent,
});

function RootComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-pulse text-emerald-500 font-medium">Loading Protocol...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-4 text-center">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 mb-2">
          GATEKEEPER
        </h1>
        <p className="text-zinc-500 mb-8 max-w-xs">Log the work. Track the progress. Own the day.</p>
        <button
          onClick={login}
          className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-full hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex justify-center">
      {/* Mobile-sized container centered on screen */}
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