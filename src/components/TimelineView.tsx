import React, { useState, useEffect } from 'react';
import { 
  GitCommit, 
  Sparkles, 
  Award, 
  Layers, 
  Briefcase, 
  FileText, 
  Info,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Check,
  List,
  Film
} from 'lucide-react';
import { TimelineEvent } from '../types';
import AIStoryMode from './AIStoryMode';

interface TimelineViewProps {
  documents: any[];
}

export default function TimelineView({ documents }: TimelineViewProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [mode, setMode] = useState<'standard' | 'story'>('story');

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await fetch('/api/timeline');
        const data = await res.json();
        setEvents(data);
        if (data.length > 0) {
          setSelectedEventId(data[data.length - 1].id); // select latest event by default
        }
      } catch (err) {
        console.error('Error fetching timeline events:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTimeline();
  }, [documents]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
        <p className="text-xs font-mono text-gray-400">Chronologizing LifeGraph milestones...</p>
      </div>
    );
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Certificates':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'Projects':
        return <Layers className="w-4 h-4 text-rose-400" />;
      case 'Internships':
        return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'Hackathons':
        return <TrendingUp className="w-4 h-4 text-purple-400" />;
      case 'Resume':
        return <FileText className="w-4 h-4 text-blue-400" />;
      default:
        return <GitCommit className="w-4 h-4 text-purple-300" />;
    }
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="space-y-8 animate-fade-in" id="timeline-view">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/20 to-blue-950/10 p-6 rounded-3xl border border-purple-950/30 glow-box">
        <div className="space-y-1">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            AI-Generated Chronological Timeline
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your milestones are extracted and mapped chronologically. Switch between Cinematic Story narration and standard tree list.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-[#110c32]/60 border border-purple-950/40 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setMode('story')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'story'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-3.5 h-3.5" /> Cinematic Story
          </button>
          <button
            onClick={() => setMode('standard')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'standard'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <List className="w-3.5 h-3.5" /> Standard List
          </button>
        </div>
      </div>

      {mode === 'story' ? (
        <AIStoryMode documents={documents} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Timeline Scroll Tree */}
          <div className="lg:col-span-2 relative pl-8 border-l border-purple-900/40 space-y-8 max-h-[550px] overflow-y-auto pr-2" id="timeline-tree">
            {events.map((event, index) => {
              const isSelected = selectedEventId === event.id;
              return (
                <div 
                  key={event.id}
                  id={`timeline-event-item-${event.id}`}
                  onClick={() => setSelectedEventId(event.id)}
                  className={`
                    relative cursor-pointer transition-all duration-300 group
                    ${isSelected ? 'scale-[1.02]' : 'hover:translate-x-1'}
                  `}
                >
                  {/* Connector Dot */}
                  <span className={`
                    absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 z-10
                    ${isSelected 
                      ? 'bg-purple-950 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-110' 
                      : 'bg-[#050117] border-purple-900/30 text-gray-500 group-hover:border-purple-600'
                    }
                  `}>
                    {getCategoryIcon(event.category)}
                  </span>

                  <div className={`
                    p-5 rounded-2xl border transition-all duration-300
                    ${isSelected 
                      ? 'bg-purple-950/25 border-purple-800/50 shadow-[inset_0_0_15px_rgba(168,85,247,0.06)]' 
                      : 'bg-black/20 border-purple-950/10 hover:bg-white/5'
                    }
                  `}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">{event.year} &bull; {event.category}</span>
                      <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {event.date}</span>
                    </div>
                    <h3 className="text-sm font-display font-bold text-white group-hover:text-purple-300 transition-colors">{event.title}</h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed truncate max-w-xl">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Event Details sidebar card */}
          <div className="bg-[#0b0629]/40 border border-purple-950/20 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] h-fit">
            {selectedEvent ? (
              <div className="space-y-5" id="timeline-detail-card">
                <div className="border-b border-purple-950/20 pb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">{selectedEvent.year} &bull; {selectedEvent.category}</span>
                  <h3 className="text-base font-display font-bold text-white mt-1">{selectedEvent.title}</h3>
                  <p className="text-[10px] text-gray-400 mt-1">Milestone established {selectedEvent.date}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Impact & Achievement</span>
                  <p className="text-xs text-gray-300 leading-relaxed bg-[#06021f]/50 p-4 rounded-xl border border-purple-950/20 font-sans">
                    {selectedEvent.description}
                  </p>
                </div>

                {selectedEvent.documentId ? (
                  <div className="p-4 bg-purple-950/20 rounded-2xl border border-purple-900/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-400 animate-pulse" />
                      <span className="text-xs font-semibold text-purple-300">Verified Evidence Proof</span>
                    </div>
                    <p className="text-[10px] text-gray-400">This timeline milestone is verified via OCR and hash checks of original document reference:</p>
                    <div className="flex items-center justify-between text-[11px] font-mono bg-black/40 p-2.5 rounded-lg border border-purple-950/40 text-gray-300 truncate">
                      <span>doc_ref_{selectedEvent.documentId}</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-bold"><Check className="w-3.5 h-3.5" /> SECURE</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-950/10 rounded-2xl border border-yellow-900/20 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-yellow-500 block font-bold">Unlinked Milestones</span>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">This milestone was manually added or extrapolated. Upload a supporting PDF certificate or letter to associate verifiable proof indicators.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Info className="w-8 h-8 mx-auto mb-2 text-purple-950" />
                <h4 className="text-xs font-semibold text-gray-400">Milestone Inspector</h4>
                <p className="text-[10px] text-gray-500 mt-1 max-w-xs mx-auto">Click any vertical milestone card on the left grid to investigate extracted insights and original file credentials.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
