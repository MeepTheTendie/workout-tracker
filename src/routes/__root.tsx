import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { SyncStatus } from '../components/SyncStatus'

export const Route = createRootRoute({
  component: () => (
    <div>
      <SyncStatus />
      <div className="container">
        <h1>💪 Workout Tracker</h1>

        <div className="tabs">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="tab"
            activeProps={{ className: 'tab active' }}
          >
            Quick Log
          </Link>
          <Link to="/workout" className="tab" activeProps={{ className: 'tab active' }}>
            Full Workout
          </Link>
          <Link to="/checkin" className="tab" activeProps={{ className: 'tab active' }}>
            Daily Check-In
          </Link>
          <Link to="/activity" className="tab" activeProps={{ className: 'tab active' }}>
            Activity
          </Link>
          <Link to="/templates" className="tab" activeProps={{ className: 'tab active' }}>
            Templates
          </Link>
          <Link to="/history" className="tab" activeProps={{ className: 'tab active' }}>
            History
          </Link>
        </div>

        <Outlet />
      </div>
    </div>
  ),
})