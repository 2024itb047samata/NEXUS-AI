import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Terminal, 
  FolderOpen, 
  Network, 
  GitCommit, 
  Sparkles, 
  Compass, 
  Play, 
  X,
  FileCode,
  Globe
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentTab: (tab: string) => void;
  onLaunchPresentation: () => void;
  documents: any[];
}

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  setCurrentTab, 
  onLaunchPresentation,
  documents 
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  // Bind Escape and Ctrl+K keys globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle, so call trigger
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Actions autocomplete lists
  const systemActions = [
    {
      label: 'Launch Live Presentation Mode',
      desc: 'Execute automated 3-minute professional demo with final cinematic speech.',
      icon: Play,
      action: () => {
        onLaunchPresentation();
        onClose();
      }
    },
    {
      label: 'Navigate to Knowledge Constellation',
      desc: 'Inspect neural connections of credentials in 3D physics star field.',
      icon: Network,
      action: () => {
        setCurrentTab('graph');
        onClose();
      }
    },
    {
      label: 'Analyze Professional DNA Matrix',
      desc: 'Visualize dynamic double-helix trait mapping and credential evidence ledgers.',
      icon: Sparkles,
      action: () => {
        setCurrentTab('dna');
        onClose();
      }
    },
    {
      label: 'Simulate Rigorous Board Interview',
      desc: 'Participate in a SpaceX/Google style hard technical interview.',
      icon: Terminal,
      action: () => {
        setCurrentTab('interviewer');
        onClose();
      }
    },
    {
      label: 'Navigate to AI Career Insights',
      desc: 'Verify gap mitigation roadmaps and role predictions.',
      icon: Compass,
      action: () => {
        setCurrentTab('insights');
        onClose();
      }
    },
    {
      label: 'Navigate to Digital Assets Vault',
      desc: 'Ingest or manage raw credentials and URL endpoints.',
      icon: FolderOpen,
      action: () => {
        setCurrentTab('uploads');
        onClose();
      }
    },
    {
      label: 'View Chronological Timeline',
      desc: 'Review verified evidence timeline milestones.',
      icon: GitCommit,
      action: () => {
        setCurrentTab('timeline');
        onClose();
      }
    }
  ];

  // Fuzzy match actions or documents
  const filteredActions = systemActions.filter(act => 
    act.label.toLowerCase().includes(query.toLowerCase()) || 
    act.desc.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(query.toLowerCase()) || 
    doc.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-start justify-center pt-[12vh] px-4 animate-fade-in" id="global-command-palette-overlay">
      
      <div 
        ref={paletteRef}
        className="w-full max-w-xl bg-[#090424]/95 border border-purple-500/30 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(168,85,247,0.25)] flex flex-col max-h-[480px]"
        id="command-palette-card"
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3.5 px-5 py-4 border-b border-purple-950/35">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search documents (e.g. 'launch', 'resume')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-gray-500 w-full focus:outline-none font-sans"
            id="palette-input-box"
          />
          <span className="text-[9px] font-mono bg-purple-950/60 border border-purple-900/30 px-2 py-1 rounded text-purple-400 font-bold shrink-0">
            ESC TO CLOSE
          </span>
        </div>

        {/* Dynamic Results list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* System Actions cluster */}
          {filteredActions.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block px-2.5">System Command Actions</span>
              <div className="space-y-1">
                {filteredActions.map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={idx}
                      onClick={act.action}
                      className="w-full text-left p-3 hover:bg-purple-950/20 hover:border-purple-800/20 border border-transparent rounded-2xl flex items-center gap-3.5 transition-all group cursor-pointer"
                    >
                      <div className="p-2 bg-purple-950/40 border border-purple-900/20 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">{act.label}</h4>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{act.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Document results cluster */}
          {filteredDocs.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block px-2.5">Synced Documents Mapped</span>
              <div className="space-y-1">
                {filteredDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setCurrentTab('uploads');
                      onClose();
                    }}
                    className="w-full text-left p-3 hover:bg-blue-950/15 hover:border-blue-900/10 border border-transparent rounded-2xl flex items-center gap-3.5 transition-all group cursor-pointer"
                  >
                    <div className="p-2 bg-blue-950/40 border border-blue-900/20 rounded-xl text-blue-400">
                      <FileCode className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{doc.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{doc.category} &bull; {doc.size}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results state */}
          {filteredActions.length === 0 && filteredDocs.length === 0 && (
            <div className="text-center py-10">
              <Terminal className="w-8 h-8 text-purple-950 mx-auto mb-2" />
              <h4 className="text-xs font-semibold text-gray-400">No Commands Or Files Found</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Try a different search input query.</p>
            </div>
          )}

        </div>

        {/* Footer shortcuts helper */}
        <div className="bg-[#06021f] px-5 py-3 border-t border-purple-950/45 flex justify-between items-center text-[9px] font-mono text-gray-400">
          <span>Use <kbd className="bg-purple-950 px-1 py-0.5 rounded text-purple-300">▲</kbd> <kbd className="bg-purple-950 px-1 py-0.5 rounded text-purple-300">▼</kbd> keys to choose</span>
          <span>Press <kbd className="bg-purple-950 px-1 py-0.5 rounded text-purple-300">Enter</kbd> to execute</span>
        </div>

      </div>

    </div>
  );
}
