import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  HelpCircle, 
  CheckCircle, 
  FileText, 
  TrendingUp, 
  ExternalLink,
  Cpu,
  Info
} from 'lucide-react';

interface SmartSearchProps {
  documents: any[];
}

export default function SmartSearch({ documents }: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const matchScores = await res.json();
      
      // Merge matchScores back with document item detail
      const mergedResults = matchScores.map((match: any) => {
        const doc = documents.find(d => d.id === match.id);
        return {
          ...match,
          document: doc
        };
      }).filter((res: any) => res.document !== undefined);

      setResults(mergedResults);
    } catch (err) {
      console.error('Semantic search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fastSearches = [
    'Resume used for Flipkart',
    'Certificate where Python appears',
    'Internship letter from IIT',
    'AI project involving Computer Vision'
  ];

  return (
    <div className="space-y-8 animate-fade-in" id="smart-search-view">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/20 to-blue-950/10 p-6 rounded-3xl border border-purple-950/30">
        <div className="space-y-1">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            Meaning-Based Semantic Search
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Submit searches describing intents rather than exact filenames. Our AI semantic evaluator indexes documents by conceptual relevance and details why each match occurs.
          </p>
        </div>
      </div>

      {/* Query Bar form */}
      <form onSubmit={handleSearch} className="flex gap-2.5">
        <div className="flex flex-1 items-center gap-3 bg-[#110c32]/60 border border-purple-950/40 rounded-2xl px-4 py-3.5 focus-within:border-purple-500 transition-all">
          <Search className="w-5 h-5 text-purple-400" />
          <input
            type="text"
            placeholder="e.g. Find documents showing experience deploying deep learning models on hardware"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-gray-500 w-full focus:outline-none"
            id="semantic-query-input"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-40 text-xs font-semibold rounded-2xl text-white transition-all cursor-pointer flex items-center gap-2"
          id="btn-semantic-search"
        >
          {loading ? <Cpu className="w-4 h-4 animate-spin" /> : 'Run AI Search'}
        </button>
      </form>

      {/* Quick Fast searches prompts */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 self-center">Quick synapses:</span>
        {fastSearches.map((fast, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQuery(fast);
              // Trigger search after state updates
              setTimeout(() => {
                const btn = document.getElementById('btn-semantic-search');
                btn?.click();
              }, 50);
            }}
            className="text-[10px] px-2.5 py-1 rounded-xl bg-purple-950/20 border border-purple-950/30 text-purple-300 hover:bg-purple-900/10 cursor-pointer font-mono"
            id={`btn-fast-search-${idx}`}
          >
            &ldquo;{fast}&rdquo;
          </button>
        ))}
      </div>

      {/* Results panel list */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
            <p className="text-xs font-mono text-gray-400">Embedding and query-ranking your Digital Brain...</p>
          </div>
        ) : results.length > 0 ? (
          results.map((res, index) => (
            <div 
              key={index}
              className="bg-[#0b0629]/40 border border-purple-950/20 p-5 rounded-3xl flex flex-col md:flex-row gap-5 items-start justify-between shadow-[0_4px_30px_rgba(0,0,0,0.4)] hover:border-purple-800/40 transition-all duration-300"
              id={`search-result-${index}`}
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-purple-950/40 flex items-center justify-center border border-purple-900/10 text-purple-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-purple-400 font-semibold">{res.document?.category}</span>
                    <h3 className="text-sm font-display font-bold text-white truncate max-w-sm">{res.document?.name}</h3>
                  </div>
                  
                  {/* Semantic match explanation card */}
                  <div className="bg-[#100b33]/40 border border-purple-900/10 p-3 rounded-xl text-xs text-gray-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block font-bold">AI Semantic Match Analysis</span>
                      <p className="mt-0.5 text-[11px] leading-relaxed italic text-gray-300 font-sans">{res.matchExplanation}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-2xl">{res.document?.metadata.summary}</p>
                </div>
              </div>

              {/* Match Score Indicator Gauge */}
              <div className="flex md:flex-col items-center gap-3 shrink-0 self-center border-l md:border-l-0 md:border-t border-purple-950/20 pl-4 md:pl-0 md:pt-4">
                <div className="text-center">
                  <div className="text-3xl font-display font-black text-purple-400 leading-none">{res.score}%</div>
                  <div className="text-[8px] font-mono uppercase tracking-widest text-gray-400 mt-1">relevance</div>
                </div>
                <span className="text-[10px] bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> VERIFIED
                </span>
              </div>
            </div>
          ))
        ) : query ? (
          <div className="text-center py-20 text-gray-500 bg-black/10 border border-dashed border-purple-950/10 rounded-3xl">
            <Info className="w-10 h-10 mx-auto mb-2 text-purple-950" />
            <h4 className="text-xs font-semibold text-gray-400">No semantic matches found</h4>
            <p className="text-[11px] text-gray-500 mt-1">We couldn&apos;t match any uploaded credentials to your query conceptually. Try describing a different role or project requirement.</p>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 bg-black/10 border border-dashed border-purple-950/10 rounded-3xl">
            <Search className="w-10 h-10 mx-auto mb-3 text-purple-950 animate-pulse" />
            <h4 className="text-xs font-semibold text-gray-400">Semantic Engine Idle</h4>
            <p className="text-[11px] text-gray-500 mt-1">Input details or search prompts above to trace credentials from your Digital Brain.</p>
          </div>
        )}
      </div>
    </div>
  );
}
