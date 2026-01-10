import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useEntries, useDeleteEntry } from '../lib/queries'
import { HistoryItem } from '../components/HistoryItem'

export const Route = createFileRoute('/history')({
  component: HistoryPage,
})

function HistoryPage() {
  const [filter, setFilter] = useState('all')
  const [limit, setLimit] = useState(50)
  const [search, setSearch] = useState('')
  
  const { entries, isLoading } = useEntries(limit)
  const deleteEntry = useDeleteEntry()

  const filteredEntries = entries.filter(e => {
    if (filter !== 'all' && e.type !== filter) return false
    if (search) {
      return JSON.stringify(e).toLowerCase().includes(search.toLowerCase())
    }
    return true
  })

  return (
    <section className="card section active">
      <h2>📜 History</h2>
      
      <div className="row2" style={{ marginBottom: 10 }}>
        <div className="form-group">
          <label>Filter</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="workout">Workouts</option>
            <option value="quick_log">Quick Logs</option>
            <option value="checkin">Check-ins</option>
            <option value="activity">Activities</option>
          </select>
        </div>
        <div className="form-group">
          <label>Show last N items</label>
          <input 
            type="number" 
            value={limit} 
            onChange={(e) => setLimit(Number(e.target.value))} 
            min="10" 
            max="500" 
          />
        </div>
      </div>

      <div className="form-group">
        <label>Search exercises/notes</label>
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Type to search..." 
        />
      </div>

      <div id="historyList">
        {isLoading && <div className="muted">Loading...</div>}
        {!isLoading && filteredEntries.length === 0 && <div className="muted">No entries found.</div>}
        {filteredEntries.map(entry => (
          <HistoryItem 
            key={entry.id} 
            entry={entry} 
            onDelete={() => {
              if(confirm('Delete this entry?')) {
                deleteEntry.mutate(entry.id!)
              }
            }} 
          />
        ))}
      </div>
    </section>
  )
}
