import { useEffect, useState } from 'react'

export function SyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className={`sync-status ${isOnline ? 'online' : 'offline'}`}>
      <div className="sync-dot"></div>
      <span>{isOnline ? 'Synced' : 'Offline'}</span>
    </div>
  )
}