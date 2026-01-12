import { createFileRoute, Link } from '@tanstack/react-router';
import { useTemplates, useDeleteTemplate } from '../lib/queries';
import type { WorkoutTemplate, Exercise } from '../lib/types';

export const Route = createFileRoute('/templates')({
  component: Templates,
});

function Templates() {
  const { templates, isLoading } = useTemplates(); // <--- FIXED
  const deleteMutation = useDeleteTemplate();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading templates...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Workout Templates</h1>
        <Link 
          to="/" 
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Back
        </Link>
      </div>

      {(!templates || templates.length === 0) ? (
        <div className="p-8 border border-dashed border-gray-700 rounded-lg text-center text-gray-500">
          No templates found. Create one to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {templates.map((template: WorkoutTemplate) => (
            <div 
              key={template.id} 
              className="bg-gray-900 border border-gray-800 p-4 rounded-lg hover:border-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-purple-400">
                  {template.name}
                </h3>
                <button
                  onClick={() => {
                    if (template.id && confirm('Delete this template?')) {
                      deleteMutation.mutate(template.id);
                    }
                  }}
                  className="text-gray-600 hover:text-red-500 transition-colors"
                  title="Delete Template"
                >
                  🗑️
                </button>
              </div>

              <div className="space-y-1">
                {template.exercises.map((ex: Exercise, i: number) => (
                  <div key={i} className="flex justify-between text-sm text-gray-400">
                    <span>{ex.name}</span>
                    <span className="text-gray-600">{ex.sets} x {ex.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}