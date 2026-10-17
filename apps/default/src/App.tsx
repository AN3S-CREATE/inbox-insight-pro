import { Database, Sparkles } from 'lucide-react';
import { InboxDashboard } from './components/InboxDashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-pattern-green">
      <header className="header-green sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-400 text-green-950">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-white">Inbox Insight Pro</h1>
              <p className="text-xs text-green-200">Private local inbox</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-green-300/30 bg-green-950/40 px-3 py-1.5 text-sm text-green-100">
            <Sparkles className="h-4 w-4 text-green-300" />
            <span>SQLite · Ollama</span>
          </div>
        </div>
      </header>
      <InboxDashboard />
    </div>
  );
}
