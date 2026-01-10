import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { SyncStatus } from '../components/SyncStatus'
import { useAuth } from '../lib/auth'
import { login, logout } from '../lib/firebase'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: 50 }}>Loading...</div>
  }

  // 🔒 THE BOUNCER: If no user, show Login Screen
  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: 100 }}>
        <h1>💪 Workout Tracker</h1>
        <div className="card" style={{ maxWidth: 400, margin: '20px auto' }}>
          <h2>Welcome Back</h2>
          <p style={{ marginBottom: 20 }}>Please sign in to access your workouts.</p>
          <button className="btn" onClick={login}>
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  // ✅ If logged in, show the App
  return (
    <div>
      <SyncStatus />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>💪 Workout Tracker</h1>
          <button className="btn small secondary" style={{ width: 'auto' }} onClick={logout}>
            Sign Out
          </button>
        </div>

        <div className="tabs">
          <Link to="/" activeOptions={{ exact: true }} className="tab" activeProps={{ className: 'tab active' }}>Quick Log</Link>
          <Link to="/workout" className="tab" activeProps={{ className: 'tab active' }}>Full Workout</Link>
          <Link to="/checkin" className="tab" activeProps={{ className: 'tab active' }}>Daily Check-In</Link>
          <Link to="/activity" className="tab" activeProps={{ className: 'tab active' }}>Activity</Link>
          <Link to="/templates" className="tab" activeProps={{ className: 'tab active' }}>Templates</Link>
          <Link to="/history" className="tab" activeProps={{ className: 'tab active' }}>History</Link>
        </div>

        <Outlet />
      </div>
    </div>
  )
}