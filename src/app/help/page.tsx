export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">
          Help & Support
        </h1>

        <div className="space-y-6">
          {/* FAQ Section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    How do I search for academic papers?
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="p-4 text-slate-600 dark:text-slate-400">
                  Simply type your search query in the search box on the home page and press Enter or click the "Scholar Search" button. You can also filter by source using the buttons above the search box.
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    What sources do you search?
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="p-4 text-slate-600 dark:text-slate-400">
                  We search across multiple academic databases including PubMed, Google Scholar, Embase, bioRxiv, and medRxiv to provide comprehensive results.
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    How do I save searches?
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="p-4 text-slate-600 dark:text-slate-400">
                  After performing a search, click the bookmark icon or go to "Saved Searches" in your profile to save it for later access.
                </div>
              </details>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Contact Support
            </h2>
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                Need more help? Reach out to our support team:
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:support@scholarsearch.com"
                  className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Email Support</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">support@scholarsearch.com</p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Live Chat</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Available 9AM-5PM EST</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Quick Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="/settings" className="text-blue-600 dark:text-blue-400 hover:underline">
                → Settings
              </a>
              <a href="/profile" className="text-blue-600 dark:text-blue-400 hover:underline">
                → Profile
              </a>
              <a href="/saved-searches" className="text-blue-600 dark:text-blue-400 hover:underline">
                → Saved Searches
              </a>
              <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                → Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
