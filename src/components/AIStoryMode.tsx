import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Award, 
  Briefcase, 
  Cpu, 
  TrendingUp, 
  Clock, 
  History
} from 'lucide-react';
import { motion } from 'motion/react';

interface AIStoryModeProps {
  documents: any[];
}

interface StoryChapter {
  year: string;
  title: string;
  category: string;
  narrative: string;
  achievement: string;
  impactScore: number;
}

export default function AIStoryMode({ documents }: AIStoryModeProps) {
  const [chapters, setChapters] = useState<StoryChapter[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Default storyboard for demonstration or compiled dynamically from uploaded documents
  useEffect(() => {
    const baseStory: StoryChapter[] = [
      {
        year: '2023',
        category: 'FOUNDATION',
        title: 'BTech CSE Academic Launch',
        narrative: 'Initiated Computer Science & Engineering curriculum, concentrating heavily on core algorithms, object-oriented system architectures, and mathematical bases of Neural Networks.',
        achievement: 'Maintained an exceptional academic trajectory with a verified 9.4/10 cumulative grade point average.',
        impactScore: 82
      },
      {
        year: '2024',
        category: 'SYSTEMS',
        title: 'Distributed Architectures & Cloud Clusters',
        narrative: 'Expanded core competence to cloud scale. Architected serverless autoscaling microservices clusters utilizing AWS infrastructure, Docker packaging, and horizontal Kubernetes container orchestrators.',
        achievement: 'Integrated multi-stage CI/CD DevOps pipelines with verified zero-downtime blue-green cluster deployments.',
        impactScore: 89
      },
      {
        year: '2025',
        category: 'SPECIALIZATION',
        title: 'Machine Learning Research at IIT Bombay',
        narrative: 'Secured prestigious Machine Learning Internship at IIT Bombay. Researched and structured deep learning computer vision frameworks to identify custom PPE safety gear on low-power edge processing nodes.',
        achievement: 'Achieved 94.2% mean Average Precision (mAP) utilizing PyTorch and highly optimized YOLOv8 custom networks.',
        impactScore: 96
      },
      {
        year: '2026',
        category: 'INTEGRATION',
        title: 'Production Optimization & LifeGraph AI Engine',
        narrative: 'Successfully compiled complete neural mapping frameworks. Ported high-overhead YOLOv8 architectures to ONNX and TensorRT runtimes, cutting inference latency by 40% while preserving absolute confidence levels.',
        achievement: 'Engineered LifeGraph AI, compiling all personal credentials, codebases, and achievements into a unified digital twin system.',
        impactScore: 99
      }
    ];

    setChapters(baseStory);
  }, [documents]);

  // Handle automatic slideshow timer ticking
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setCurrentIdx(idx => (idx + 1) % chapters.length);
            return 0;
          }
          return p + 1.5;
        });
      }, 70);
    }
    return () => clearInterval(timer);
  }, [isPlaying, chapters.length]);

  const handleNext = () => {
    setCurrentIdx(idx => (idx + 1) % chapters.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIdx(idx => (idx - 1 + chapters.length) % chapters.length);
    setProgress(0);
  };

  if (chapters.length === 0) return null;

  const activeChapter = chapters[currentIdx];

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'FOUNDATION': return 'text-blue-400 border-blue-900/50 bg-blue-950/20';
      case 'SYSTEMS': return 'text-rose-400 border-rose-900/50 bg-rose-950/20';
      case 'SPECIALIZATION': return 'text-emerald-400 border-emerald-900/50 bg-emerald-950/20';
      default: return 'text-purple-400 border-purple-900/50 bg-purple-950/20';
    }
  };

  return (
    <div className="bg-[#050117] border border-purple-950/30 rounded-3xl p-6 md:p-8 shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative overflow-hidden h-[440px] flex flex-col justify-between" id="ai-story-mode-narrator">
      
      {/* Animated cinematic grid background lines */}
      <div className="absolute inset-0 bg-radial-grid opacity-20 pointer-events-none"></div>

      {/* Narrative Header overlay */}
      <div className="flex items-center justify-between border-b border-purple-950/20 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-purple-400 animate-pulse" />
          <div>
            <h3 className="font-display font-extrabold text-xs text-white uppercase tracking-wider">AI Story Narrator</h3>
            <span className="text-[9px] font-mono text-purple-400">CINEMATIC TIMELINE UNBOUNDED</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-3 py-1 bg-purple-950/30 border border-purple-800/40 rounded-xl text-[10px] font-semibold text-purple-300 hover:bg-purple-900/40 transition-all cursor-pointer"
            id="story-play-toggle"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-purple-400 stroke-purple-400" /> PAUSE INSIGHT
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-purple-400 stroke-purple-400" /> NARRATE JOURNEY
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main cinematic text plate */}
      <div className="my-auto py-4 relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl md:text-5xl font-display font-black text-purple-500 font-mono tracking-tighter">
            {activeChapter.year}
          </span>
          <span className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${getCategoryTheme(activeChapter.category)}`}>
            {activeChapter.category}
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg md:text-2xl font-display font-black text-white tracking-tight leading-snug">
            {activeChapter.title}
          </h2>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed max-w-2xl font-sans">
            {activeChapter.narrative}
          </p>
        </div>

        <div className="flex items-start gap-2.5 bg-[#0b0629]/50 border border-purple-950/20 p-3.5 rounded-2xl max-w-xl">
          <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-400 leading-normal font-mono font-medium">
            <strong className="text-white">Milestone Impact:</strong> {activeChapter.achievement}
          </p>
        </div>
      </div>

      {/* Slide timeline footer indicators */}
      <div className="flex items-center justify-between border-t border-purple-950/20 pt-4 relative z-10">
        <div className="flex items-center gap-1.5">
          {chapters.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIdx(idx);
                setProgress(0);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIdx 
                  ? 'w-8 bg-purple-500 shadow-[0_0_8px_#a855f7]' 
                  : 'w-2.5 bg-purple-950 hover:bg-purple-900'
              }`}
            />
          ))}
        </div>

        {/* Manual Slideshow Arrows */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-400 mr-2">
            CHAPTER {currentIdx + 1} OF {chapters.length}
          </span>
          <button 
            onClick={handlePrev}
            className="p-1.5 rounded-xl bg-[#110c32]/50 border border-purple-950/40 text-purple-400 hover:text-white hover:border-purple-500/40 transition-all cursor-pointer"
            id="story-btn-prev"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleNext}
            className="p-1.5 rounded-xl bg-[#110c32]/50 border border-purple-950/40 text-purple-400 hover:text-white hover:border-purple-500/40 transition-all cursor-pointer"
            id="story-btn-next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive timer ticker progress bar */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-75" style={{ width: `${progress}%` }}></div>
      )}

      {/* Embedded grid overlay CSS */}
      <style>{`
        .bg-radial-grid {
          background-image: linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
}
