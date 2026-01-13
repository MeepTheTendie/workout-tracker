import { Outlet, createFileRoute } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';

export const Route = createFileRoute('__root')({
  component: RootComponent,
});

function RootComponent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 flex justify-center text-zinc-100 font-sans">
      {/* App Container */}
      <div className="w-full max-w-md flex flex-col min-h-screen relative shadow-2xl shadow-black bg-zinc-950">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-white italic">
              GATEKEEPER
            </h1>
            <span className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase">
              Dev Mode Bypass
            </span>
          </div>
          
          {/* User Avatar Placeholder */}
          <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 font-bold">
             {user?.photoURL ? (
               <img src={user.photoURL} alt="User" className="h-full w-full rounded-full object-cover" />
             ) : (
               <span>D</span>
             )}
          </div>
        </header>

        {/* Main Content - No Checks, Just Render */}
        <main className="flex-1 px-4 pb-24">
          <Outlet />
        </main>

        {/* Navigation Bar (Optional - Floating at bottom) */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-lg border border-zinc-800/50 shadow-2xl rounded-full px-6 py-3 flex gap-8 items-center z-50">
          <a href="/" className="text-zinc-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </a>
          <a href="/activity" className="text-zinc-400 hover:text-emerald-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </a>
          <a href="/workout" className="bg-emerald-500 text-black p-2 rounded-full -mt-8 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-transform hover:scale-105">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          </a>
          <a href="/checkin" className="text-zinc-400 hover:text-blue-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          </a>
          <a href="/history" className="text-zinc-400 hover:text-purple-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </a>
        </nav>

      </div>
    </div>
  );
}