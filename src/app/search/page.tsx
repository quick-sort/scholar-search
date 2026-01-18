'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Search, X, ExternalLink, Users, Calendar, BookOpen, Send, Bot, User as UserIcon, GripVertical, Clock, ChevronDown, Settings, LogOut, UserCircle, Bookmark, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChat } from '@ai-sdk/react';

interface SearchResult {
  id: string;
  title: string;
  journal: string;
  authors: string[];
  publishDate: string;
  summary: string;
  source: 'PubMed' | 'Google Scholar' | 'Embase' | 'bioRxiv' | 'medRxiv';
  url?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Mock search results
const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'CRISPR-Cas9 gene editing: A comprehensive review of therapeutic applications',
    journal: 'Nature Medicine',
    authors: ['Sarah Chen', 'Michael Rodriguez', 'Emily Watson', 'David Kim'],
    publishDate: '2024-03-15',
    summary: 'This review examines the current state of CRISPR-Cas9 gene editing technology and its therapeutic applications. The authors discuss recent advances in delivery methods, off-target effects reduction, and clinical trials for genetic disorders. Key findings include a 78% success rate in ex vivo editing for sickle cell disease and promising results for beta-thalassemia treatments.',
    source: 'PubMed',
    url: '#',
  },
  {
    id: '2',
    title: 'mRNA vaccine technology: From COVID-19 to future applications in oncology',
    journal: 'Science',
    authors: ['James Liu', 'Anna Martinez', 'Robert Chang'],
    publishDate: '2024-02-28',
    summary: 'This paper explores the evolution of mRNA vaccine technology following its success in COVID-19 prevention. The researchers detail novel lipid nanoparticle formulations and discuss ongoing clinical trials for cancer immunotherapy. Early phase trials show 65% objective response rate in melanoma patients with personalized neoantigen vaccines.',
    source: 'Google Scholar',
    url: '#',
  },
  {
    id: '3',
    title: 'Novel biomarkers for early detection of Alzheimer\'s disease: A meta-analysis',
    journal: 'The Lancet Neurology',
    authors: ['Maria Garcia', 'Thomas Anderson', 'Lisa Park', 'John Smith'],
    publishDate: '2024-01-10',
    summary: 'A comprehensive meta-analysis of 47 studies evaluating blood-based biomarkers for Alzheimer\'s detection. The study identifies plasma p-tau217 as the most promising biomarker with 89% sensitivity and 88% specificity for distinguishing AD from other neurodegenerative conditions. Combination panels including GFAP and NfL show improved diagnostic accuracy.',
    source: 'Embase',
    url: '#',
  },
  {
    id: '4',
    title: 'Single-cell sequencing reveals tumor microenvironment heterogeneity in breast cancer',
    journal: 'Cell',
    authors: ['Jennifer Lee', 'Alex Thompson', 'Rachel Green'],
    publishDate: '2024-03-01',
    summary: 'Using single-cell RNA sequencing on 150 tumor samples, this study maps the cellular landscape of breast cancer microenvironments. The research identifies distinct immune cell populations associated with treatment response and discovers a novel fibroblast subtype correlated with poor prognosis. Findings suggest new targets for combination immunotherapies.',
    source: 'bioRxiv',
    url: '#',
  },
  {
    id: '5',
    title: 'Long-term outcomes of COVID-19 hospitalization: A 2-year follow-up study',
    journal: 'JAMA',
    authors: ['William Brown', 'Sophie Taylor', 'Mark Johnson', 'Laura Davis'],
    publishDate: '2024-02-15',
    summary: 'This prospective cohort study follows 1,234 COVID-19 survivors for 2 years post-hospitalization. Results show persistent symptoms in 27% of patients, with fatigue, dyspnea, and cognitive impairment most commonly reported. Risk factors for long COVID include severe acute illness and pre-existing diabetes. The study provides insights into natural recovery trajectories.',
    source: 'medRxiv',
    url: '#',
  },
];

const sourceColors: Record<SearchResult['source'], string> = {
  PubMed: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800',
  'Google Scholar': 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900 dark:text-sky-300 dark:border-sky-800',
  Embase: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800',
  bioRxiv: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800',
  medRxiv: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800',
};

export default function SearchPage() {
  const [query, setQuery] = useState('CRISPR gene editing');
  const [selectedSource, setSelectedSource] = useState<SearchResult['source'] | null>(null);
  const [results] = useState<SearchResult[]>(mockResults);

  // AI SDK chat hook with streaming
  const { messages: chatMessages, input: chatInput, handleInputChange, handleSubmit, isLoading: isTyping } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: `Based on your search for "CRISPR gene editing", here are the key findings from the literature:

**Key Themes:**
- CRISPR-Cas9 shows 78% success rate in ex vivo editing trials
- mRNA vaccine technology expanding to oncology applications
- Blood-based biomarkers improving early disease detection
- Single-cell sequencing revealing tumor microenvironment complexity

**Research Trends:**
Recent publications indicate a shift toward personalized medicine approaches, with gene editing and immunotherapy leading innovation in treatment modalities. The integration of AI in biomarker discovery is accelerating translational research.

**Suggested Readings:**
For deeper understanding, consider exploring clinical trial data from Phase III CRISPR studies and recent FDA approvals for gene therapies.`,
      },
    ],
  });

  // Search history state
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'CRISPR gene editing',
    'mRNA vaccines cancer immunotherapy',
    'Alzheimer biomarkers early detection',
    'single-cell sequencing tumor',
    'long COVID outcomes',
  ]);
  const [showHistory, setShowHistory] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const historyDropdownRef = useRef<HTMLDivElement>(null);

  // User menu state
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const chatTextareaRef = useRef<HTMLTextAreaElement>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Resizable state
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = useCallback(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = chatTextareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [chatInput]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close history dropdown
      if (
        historyDropdownRef.current &&
        !historyDropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }

      // Close user menu dropdown
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // Constrain between 20% and 80%
    setLeftPanelWidth(Math.max(20, Math.min(80, newWidth)));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const filteredResults = selectedSource
    ? results.filter((r) => r.source === selectedSource)
    : results;

  const sources = Object.keys(sourceColors) as Array<SearchResult['source']>;

  // Handle search history
  const handleSearchSubmit = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Add to history if not already present
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item !== searchQuery);
      return [searchQuery, ...filtered].slice(0, 10); // Keep only 10 most recent
    });

    setQuery(searchQuery);
    setShowHistory(false);
  };

  const handleHistoryItemClick = (historyItem: string) => {
    setQuery(historyItem);
    setShowHistory(false);
  };

  const filteredHistory = searchHistory.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Header with Search */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm relative">
        <div className="w-full px-4 py-4">
          <div className="flex items-center gap-4">
            <a href="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Scholar<span className="text-blue-600">Search</span>
              </h1>
            </a>
            <div className="flex-1 max-w-2xl relative" ref={historyDropdownRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search academic literature..."
                  className="h-10 pl-10 pr-10 text-sm border-slate-300 dark:border-slate-700"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setShowHistory(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit(query);
                    }
                  }}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Search History Dropdown */}
              {showHistory && filteredHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  <div className="p-2">
                    <div className="flex items-center justify-between px-3 py-2 mb-1">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        Recent Searches
                      </span>
                      <button
                        onClick={() => setSearchHistory([])}
                        className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        Clear all
                      </button>
                    </div>
                    {filteredHistory.map((historyItem, index) => (
                      <button
                        key={index}
                        onClick={() => handleHistoryItemClick(historyItem)}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors flex items-center gap-2 group"
                      >
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="flex-1 truncate">{historyItem}</span>
                        <X
                          className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-600 dark:hover:text-slate-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchHistory((prev) => prev.filter((item) => item !== historyItem));
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Source Filters */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {sources.map((source) => (
              <button
                key={source}
                onClick={() => setSelectedSource(selectedSource === source ? null : source)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  selectedSource === source
                    ? sourceColors[source]
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-700'
                }`}
              >
                {source}
              </button>
            ))}
          </div>

          {/* User Avatar with Dropdown - Positioned at top right */}
          <div className="absolute top-4 right-4" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                JD
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform ${
                  showUserMenu ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">John Doe</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">john.doe@example.com</p>
                </div>
                <div className="p-1">
                  <a
                    href="/profile"
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <UserCircle className="h-4 w-4 text-slate-500" />
                    Profile
                  </a>
                  <a
                    href="/saved-searches"
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <Bookmark className="h-4 w-4 text-slate-500" />
                    Saved Searches
                  </a>
                  <a
                    href="/settings"
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <Settings className="h-4 w-4 text-slate-500" />
                    Settings
                  </a>
                  <a
                    href="/help"
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <HelpCircle className="h-4 w-4 text-slate-500" />
                    Help & Support
                  </a>
                </div>
                <div className="p-1 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => (window.location.href = '/login')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <main className="flex-1 flex overflow-hidden">
        <div ref={containerRef} className="flex w-full">
          {/* Left: Search Results List */}
          <div
            style={{ width: `${leftPanelWidth}%` }}
            className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col min-w-0"
          >
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Results ({filteredResults.length})
                </h2>
                {selectedSource && (
                  <button
                    onClick={() => setSelectedSource(null)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
              {filteredResults.map((result) => (
                <Card
                  key={result.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-base leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {result.url ? (
                          <a href={result.url} target="_blank" rel="noopener noreferrer">
                            {result.title}
                            <ExternalLink className="inline-block ml-1 h-3 w-3" />
                          </a>
                        ) : (
                          result.title
                        )}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {result.journal}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {result.authors.length > 2
                          ? `${result.authors.slice(0, 2).join(', ')} et al.`
                          : result.authors.join(', ')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(result.publishDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <Badge className={`text-xs ${sourceColors[result.source]}`}>
                      {result.source}
                    </Badge>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {result.summary}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Resizable Splitter */}
          <div
            onMouseDown={handleMouseDown}
            className={`w-1 bg-slate-200 dark:bg-slate-700 hover:bg-blue-400 dark:hover:bg-blue-600 cursor-col-resize transition-colors relative group ${
              isDragging ? 'bg-blue-500 dark:bg-blue-500' : ''
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <GripVertical className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </div>
          </div>

          {/* Right: AI Chat Thread */}
          <div className="flex flex-col bg-slate-50 dark:bg-slate-950 flex-1 min-w-0">
            <div className="sticky top-0 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-4 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  AI Research Assistant
                </h2>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 max-h-[calc(100vh-30px)]">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 overflow-hidden ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                      {message.role === 'assistant' ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        message.role === 'user'
                          ? 'text-blue-100'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {'timestamp' in message && message.timestamp
                        ? (message.timestamp as Date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : new Date().toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              {/* Invisible div for auto-scroll */}
              <div ref={chatMessagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3">
              <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                <textarea
                  ref={chatTextareaRef}
                  placeholder="Ask about the research findings..."
                  className="flex-1 resize-none rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 dark:focus:ring-slate-300 min-h-[40px] max-h-[200px] overflow-y-auto"
                  value={chatInput}
                  onChange={handleInputChange}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-10 w-10 flex-shrink-0"
                  disabled={!(chatInput || '').trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
