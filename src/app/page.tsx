'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const sources = [
  { name: 'PubMed', color: 'text-blue-600', icon: '📄' },
  { name: 'Google Scholar', color: 'text-blue-500', icon: '🎓' },
  { name: 'Embase', color: 'text-green-600', icon: '💊' },
  { name: 'bioRxiv', color: 'text-red-600', icon: '🧬' },
  { name: 'medRxiv', color: 'text-orange-600', icon: '🏥' },
] as const;

type Source = (typeof sources)[number]['name'];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-slate-800 dark:text-slate-100">
            Scholar<span className="text-blue-600">Search</span>
          </h1>
        </div>

        {/* Source Icons */}
        <div className="flex gap-6 mb-8">
          {sources.map((source) => (
            <button
              key={source.name}
              onClick={() => setSelectedSource(selectedSource === source.name ? null : source.name)}
              className={`flex flex-col items-center gap-2 transition-all duration-200 ${
                selectedSource === source.name
                  ? 'scale-110 opacity-100'
                  : selectedSource
                  ? 'scale-100 opacity-40 hover:opacity-60'
                  : 'scale-100 opacity-100 hover:opacity-80'
              }`}
              title={source.name}
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm transition-all duration-200 ${
                  selectedSource === source.name
                    ? 'bg-blue-50 dark:bg-blue-950 ring-2 ring-blue-500'
                    : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {source.icon}
              </div>
              <span className={`text-xs font-medium ${source.color}`}>
                {source.name}
              </span>
            </button>
          ))}
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              type="text"
              placeholder="Search academic literature..."
              className="h-14 pl-12 pr-12 text-base rounded-full border-slate-300 dark:border-slate-700 shadow-md focus:shadow-xl transition-shadow"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Search Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              type="submit"
              size="lg"
              className="rounded-full px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
            >
              Scholar Search
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="rounded-full px-8"
              onClick={() => {
                if (query.trim()) {
                  console.log('Feeling lucky with:', query);
                }
              }}
            >
              I&apos;m Feeling Lucky
            </Button>
          </div>

          {/* Selected Source Indicator */}
          {selectedSource && (
            <div className="text-center mt-4 text-sm text-slate-600 dark:text-slate-400">
              Searching in: <span className="font-semibold">{selectedSource}</span>
              <button
                type="button"
                onClick={() => setSelectedSource(null)}
                className="ml-2 text-blue-600 hover:underline"
              >
                Clear
              </button>
            </div>
          )}
        </form>

        {/* Quick Search Examples */}
        <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
          <p className="mb-2">Try searching:</p>
          <div className="flex gap-3 flex-wrap justify-center">
            {['CRISPR gene editing', 'mRNA vaccines', 'Alzheimer biomarkers'].map(
              (example) => (
                <button
                  key={example}
                  onClick={() => setQuery(example)}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  {example}
                </button>
              )
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
          <div className="flex gap-6">
            <a href="/about" className="hover:underline">
              About
            </a>
            <a href="/login" className="hover:underline">
              Sign In
            </a>
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:underline">
              Privacy
            </a>
            <a href="/terms" className="hover:underline">
              Terms
            </a>
            <a href="/settings" className="hover:underline">
              Settings
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
