import React from 'react';
import { 
  TrendingUp, 
  Target, 
  Cpu, 
  Sparkles, 
  Zap, 
  MapPin, 
  LineChart, 
  ShieldAlert,
  ArrowUpRight,
  GraduationCap
} from 'lucide-react';

interface CareerForecastProps {
  documents: any[];
}

export default function CareerForecast({ documents }: CareerForecastProps) {
  const roles = [
    {
      title: 'Machine Learning Engineer',
      match: 94,
      skills: ['PyTorch', 'YOLOv8', 'Python', 'FastAPI', 'OpenCV'],
      missing: ['TensorRT Orchestrations', 'CUDA Optimization'],
      recs: 'Publish a public GitHub demo optimizing YOLOv8 models using TensorRT engine files to complete the alignment.',
      color: 'stroke-purple-500 text-purple-300 shadow-purple-500/20'
    },
    {
      title: 'Computer Vision Scientist',
      match: 91,
      skills: ['OpenCV', 'PyTorch', 'Image Classification', 'YOLOv8'],
      missing: ['C++ High-Performance Inference'],
      recs: 'Port your custom Smart PPE engine to native C++ threads to demonstrate embedded capabilities.',
      color: 'stroke-blue-500 text-blue-300 shadow-blue-500/20'
    },
    {
      title: 'Full-Stack Developer',
      match: 86,
      skills: ['React', 'FastAPI', 'WebSockets', 'AWS Infrastructure', 'Docker'],
      missing: ['Next.js Framework', 'GraphQL APIs'],
      recs: 'Re-factor your placement index portfolio server using Next.js 15 App Router to demonstrate advanced React architectures.',
      color: 'stroke-emerald-500 text-emerald-300 shadow-emerald-500/20'
    }
  ];

  return (
    <div className="space-y-6" id="career-forecast-component">
      
      {/* Upper banner info */}
      <div className="flex items-center gap-2 mb-1">
        <Target className="w-5 h-5 text-purple-400 animate-pulse" />
        <div>
          <h3 className="font-display font-extrabold text-xs text-white uppercase tracking-wider">AI Career Readiness & Forecasts</h3>
          <p className="text-[10px] text-gray-400">Deep prediction metrics outlining your fitness indexes against current market role profiles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role, idx) => {
          return (
            <div 
              key={idx} 
              className="bg-[#0b0629]/40 border border-purple-950/20 p-5 rounded-3xl flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.4)] hover:border-purple-500/25 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Floating backdrop glow */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-purple-500/5 rounded-full filter blur-xl group-hover:bg-purple-500/10 transition-all duration-300"></div>

              {/* Title & Match Gauge */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-0.5 max-w-[150px]">
                  <span className="text-[8px] font-mono text-purple-400 tracking-wider block font-bold">ALIGNED ROLE</span>
                  <h4 className="text-xs font-display font-extrabold text-white leading-tight group-hover:text-purple-300 transition-colors">{role.title}</h4>
                </div>

                {/* Match percentage circular gauge */}
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" className="stroke-[#0c0827]" strokeWidth="10" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      className={role.color.split(' ')[0]} 
                      strokeWidth="10" 
                      fill="transparent" 
                      strokeDasharray="263.8"
                      strokeDashoffset={263.8 - (263.8 * role.match) / 100}
                    />
                  </svg>
                  <span className="absolute text-[10px] font-display font-black text-white">{role.match}%</span>
                </div>
              </div>

              {/* Mapped competency lists */}
              <div className="space-y-3.5 border-t border-purple-950/25 pt-3.5">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Verified Competency</span>
                  <div className="flex flex-wrap gap-1">
                    {role.skills.map((s, i) => (
                      <span key={i} className="text-[8px] px-1.5 py-0.5 rounded bg-purple-950/20 border border-purple-900/30 text-purple-400">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-amber-400 uppercase tracking-widest block font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-500" /> Technology Gap
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {role.missing.map((m, i) => (
                      <span key={i} className="text-[8px] px-1.5 py-0.5 rounded bg-yellow-950/15 border border-yellow-900/30 text-yellow-400">{m}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-black/30 border border-purple-950/10 p-3 rounded-xl">
                  <span className="text-[8px] font-mono text-purple-300 uppercase tracking-wider block font-bold mb-1">AI Recommendation</span>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-sans">{role.recs}</p>
                </div>
              </div>

              {/* Action Button */}
              <button className="mt-4 w-full py-2 bg-gradient-to-r from-purple-950/30 to-blue-950/30 border border-purple-900/30 rounded-xl text-[9px] font-mono text-gray-300 hover:text-white hover:border-purple-500/40 transition-all flex items-center justify-center gap-1">
                View Gap Roadmap <ArrowUpRight className="w-3 h-3" />
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}
