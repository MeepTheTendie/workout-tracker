import { createFileRoute } from '@tanstack/react-router'
import { useTemplates, useDeleteTemplate } from '../lib/queries'

export const Route = createFileRoute('/templates')({
  component: TemplatesPage,
})

function TemplatesPage() {
  const { templates, isLoading } = useTemplates()
  const deleteTemplate = useDeleteTemplate()

  if (isLoading) return <div className="muted">Loading templates...</div>

  return (
    <section className="card section active">
      <h2>📝 Workout Templates</h2>
      <div className="info-box">
        Save and reuse your favorite workouts.
      </div>

      <div className="template-list">
        {templates.length === 0 ? (
          <div className="muted">No templates saved yet. Create one from the Full Workout tab!</div>
        ) : (
          templates.map((t) => (
            <div key={t.id} className="template-card">
              <h3>{t.name}</h3>
              <div className="template-meta">
                <span>{t.exercises.length} exercise{t.exercises.length !== 1 ? 's' : ''}</span>
                <span>•</span>
                <span>
                  {t.exercises.slice(0, 3).map((e) => e.name).join(', ')}
                  {t.exercises.length > 3 ? '...' : ''}
                </span>
              </div>
              <div className="template-actions">
                <button 
                  className="btn small success" 
                  onClick={() => alert("Load manually via 'Load Last Workout' in the Workout tab for now!")}
                >
                  Load
                </button>
                <button
                  className="btn small secondary"
                  onClick={() => {
                    if (confirm('Delete this template?')) {
                      deleteTemplate.mutate(t.id!)
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}