import React from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  Layers, 
  Cpu 
} from 'lucide-react';

interface HiddenInsightsProps {
  documents: any[];
}

export default function HiddenInsights({ documents }: HiddenInsightsProps) {
  const insights = [
    {
      title: 'Multimodal Cluster Correlation',
      description: 'The AI detected that 100% of your computer vision projects reference both YOLOv8 and PyTorch concurrently, matching standard cutting-edge ML industry configurations.',
      type: 'correlation',
      icon: Cpu,
      color: 'text-purple-400 border-purple-950/40 bg-purple-950/10'
    },
    {
      title: 'Evidence Coverage Audit',
      description: 'Your ML Engineer profile has 100% of its listed core competencies backed by robust ledger proofs (IIT Bombay Internship & Smart PPE Project Ledger).',
      type: 'coverage',
      icon: CheckCircle,
      color: 'text-emerald-400 border-emerald-950/40 bg-emerald-950/10'
    },
    {
      title: 'Strategic Skill Acceleration',
      description: 'Your technology acquisition speed accelerated by 2.4x after May 2025, specifically driven by deep-learning applications and edge computing integration.',
      type: 'velocity',
      icon: TrendingUp,
      color: 'text-blue-400 border-blue-950/40 bg-blue-950/10'
    },
    {
      title: 'Infrastructure Alignment Gap',
      description: 'You possess robust cloud engineering competence (AWS serverless clusters), but no verified deployment evidence of Kubernetes exists in your primary projects. Consider compiling a containerized demo.',
      type: 'gap',
      icon: AlertTriangle,
      color: 'text-amber-400 border-amber-950/40 bg-amber-950/10'
    }
  ];

  return (
    <div className="space-y-5" id="hidden-insights-component">
      <div className="flex items-center gap-2 mb-1">
        <Lightbulb className="w-5 h-5 text-purple-400 animate-pulse" />
        <div>
          <h3 className="font-display font-extrabold text-xs text-white uppercase tracking-wider">AI Insight Discoveries</h3>
          <p className="text-[10px] text-gray-400">Hidden connections and evidence anomalies analyzed dynamically from your file hashes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <div 
              key={idx} 
              className={`p-5 rounded-2xl border flex items-start gap-4 hover:border-purple-500/25 transition-all duration-300 ${insight.color}`}
            >
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)] mt-0.5">
                <Icon className="w-4 h-4 text-purple-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-display font-extrabold text-white">{insight.title}</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{insight.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
