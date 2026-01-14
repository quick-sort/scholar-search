export default function SavedSearchesPage() {
  const savedSearches = [
    { id: 1, query: 'CRISPR gene editing', date: '2024-01-15', count: 156 },
    { id: 2, query: 'mRNA vaccines cancer immunotherapy', date: '2024-01-14', count: 89 },
    { id: 3, query: 'Alzheimer biomarkers early detection', date: '2024-01-13', count: 234 },
    { id: 4, query: 'single-cell sequencing tumor', date: '2024-01-12', count: 67 },
    { id: 5, query: 'long COVID outcomes', date: '2024-01-11', count: 145 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">
          Saved Searches
        </h1>

        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Search Query
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Results
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Saved Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {savedSearches.map((search) => (
                  <tr key={search.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-6 py-4">
                      <a
                        href={`/search?q=${encodeURIComponent(search.query)}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        {search.query}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {search.count} papers
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {new Date(search.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 dark:text-blue-400 hover:underline mr-4">
                        Run
                      </button>
                      <button className="text-red-600 dark:text-red-400 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {savedSearches.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                No saved searches yet. Save a search to see it here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
