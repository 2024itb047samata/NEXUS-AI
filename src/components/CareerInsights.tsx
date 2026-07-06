import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  MapPin, 
  CheckCircle, 
  Info, 
  AlertTriangle,
  Award,
  Layers,
  ArrowRight,
  Briefcase
} from 'lucide-react';

interface CareerInsightsProps {
  documents: any[];
}

export default function CareerInsights({ documents }: CareerInsightsProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch('/api/insights');
        const data = await res.json();
        setInsights(data);
      } catch (err) {
        console.error('Error fetching career insights:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [documents]);

  if (loading || !insights) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
        <p className="text-xs font-mono text-gray-400">Pipelining career alignment benchmarks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="career-insights-view">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/20 to-blue-950/10 p-6 rounded-3xl border border-purple-950/30">
        <div className="space-y-1">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400 animate-pulse" />
            AI Career Gap Analysis
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            We map your certifications and experience against market demands. Below is a structured gap roadmap and matching positions index compiled from your files.
          </p>
        </div>
      </div>

      {/* Numerical Scores row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.scores && Object.entries(insights.scores).map(([key, value]: [string, any]) => (
          <div key={key} className="bg-[#0b0629]/40 border border-purple-950/20 p-5 rounded-3xl flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">{key} Index</span>
              <h3 className="text-base font-display font-bold text-white capitalize">{key} Identity</h3>
              <p className="text-[10px] text-gray-400 max-w-[140px]">Mapped conceptually from academic transcripts.</p>
            </div>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-[#0e0a29]" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  className="stroke-purple-500" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * value) / 100}
                />
              </svg>
              <div className="absolute text-sm font-display font-bold text-white">{value}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Roadmap & Recommendations row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gap roadmap card on Left */}
        <div className="lg:col-span-2 bg-[#0b0629]/40 border border-purple-950/20 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] space-y-6">
          <div className="flex items-center gap-2 border-b border-purple-950/20 pb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-bold text-sm text-white">Suggested Skills Roadmap & Gap Mitigation</h3>
          </div>

          <div className="space-y-4">
            {insights.gapAnalysis?.map((gap: any, index: number) => (
              <div 
                key={index}
                className="bg-[#110c32]/40 border border-purple-950/20 p-4 rounded-2xl space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-widest block">GAP DETECTED</span>
                    <h4 className="text-xs font-display font-semibold text-white mt-0.5">{gap.skill}</h4>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-yellow-950/20 border border-yellow-900/30 text-yellow-400 font-bold">HIGH PRIORITY</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-sans">{gap.recommendation}</p>

                <div className="flex gap-2 border-t border-purple-950/10 pt-2.5">
                  <span className="text-[9px] bg-purple-950/40 border border-purple-900/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                    Estimated Prep: 3-4 Weeks
                  </span>
                  <span className="text-[9px] bg-purple-950/40 border border-purple-900/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                    Cost: FREE/SaaS Offset
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Jobs cards on Right */}
        <div className="bg-[#0b0629]/40 border border-purple-950/20 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] space-y-6">
          <div className="flex items-center gap-2 border-b border-purple-950/20 pb-4">
            <Briefcase className="w-5 h-5 text-blue-400 animate-pulse" />
            <h3 className="font-display font-bold text-sm text-white">Ideal Positions Match</h3>
          </div>

          <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
            {insights.recommendedJobs?.map((job: any, index: number) => (
              <div 
                key={index}
                className="p-4 bg-black/30 border border-purple-950/20 rounded-2xl space-y-3 hover:border-purple-800/40 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-display font-bold text-white truncate max-w-[140px]">{job.title}</h4>
                    <p className="text-[9px] text-gray-400 mt-0.5 font-semibold capitalize">{job.company}</p>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-950/30 border border-purple-900/30 px-2 py-0.5 rounded">
                    {job.matchScore}% Match
                  </span>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-gray-300 bg-[#110c32]/50 p-2 rounded-xl border border-purple-950/20">
                  <span>Sal Index: <strong>{job.salary}</strong></span>
                  <span className="text-purple-400 hover:underline cursor-pointer flex items-center gap-0.5">Apply Now <ArrowRight className="w-3 h-3" /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
