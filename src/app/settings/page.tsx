export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Appearance
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">Dark Mode</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Toggle dark mode theme
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform dark:translate-x-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Search Preferences */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Search Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Results per page
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">Auto-save searches</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Save search history automatically
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white shadow transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">Email notifications</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Receive updates about new papers
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Account
            </h2>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                Change password
              </button>
              <button className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-md transition-colors">
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
