import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Cpu, 
  Network, 
  Fingerprint, 
  History, 
  Lightbulb, 
  MessageSquare, 
  CheckCircle, 
  X, 
  ArrowRight, 
  ChevronRight, 
  Volume2, 
  Sparkles, 
  Award, 
  Compass,
  FileCode,
  ShieldCheck,
  Activity,
  LogIn
} from 'lucide-react';
import { motion } from 'motion/react';

interface PresentationModeProps {
  onClose: () => void;
  setCurrentTab: (tab: string) => void;
  documents: any[];
}

type StepType = 'boot' | 'ingest' | 'constellation' | 'digital_twin' | 'story' | 'insight' | 'query' | 'cinematic' | 'complete';

export default function PresentationMode({ onClose, setCurrentTab, documents }: PresentationModeProps) {
  const [activeStep, setActiveStep] = useState<StepType>('boot');
  const [logStream, setLogStream] = useState<string[]>([]);
  const [autoRun, setAutoRun] = useState(true);
  const [typingText, setTypingText] = useState('');
  const logTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound/Vibe triggers
  const [isMuted, setIsMuted] = useState(true);

  // Scripted log messages for AI Reasoning Panel
  const IngestLogs = [
    '⚡ BOOT: LifeGraph Ingest Pipeline core initialized successfully.',
    '📂 INGEST: Reading Alex_Mercer_Placement_Resume_2026.pdf...',
    '👁️ OCR ACTIVE: Processing pdf file grid matrices (Confidence: 99.4%)',
    '🎓 EXTRACTION: Mapped Education - Bachelor of Technology in CSE, GPA: 9.4/10',
    '📂 INGEST: Reading IIT_Bombay_ML_Internship_Ledger.pdf...',
    '🧠 UNDERSTANDING: Found job title: "Machine Learning Intern" at IIT Bombay.',
    '🧠 UNDERSTANDING: Extracted achievement "Achieved 94.2% mAP on custom datasets using PyTorch and YOLOv8"',
    '⚡ BINDING: Linking "YOLOv8", "PyTorch" and "OpenCV" core competencies...',
    '📂 INGEST: Reading AWS_Serverless_Autoscaling_Badge.pdf...',
    '👁️ OCR ACTIVE: Analyzing system-level cloud architecture badges (Confidence: 98.7%)',
    '🛡️ VERIFICATION: Matching credentials hashes against university public ledger keys... MATCHED SECURE',
    '🛰️ CONSTEL: Syncing extracted entities into the live Memory Galaxy. Generating 28 neural nodes...',
    '🧬 COMPILING: Re-synthesizing AI Digital Twin parameters based on 100% evidence coverage.'
  ];

  // Scripted AI Chat query & answer typing simulation
  const ChatQuery = "Verify my readiness for Tesla's Machine Learning Engineer requirements based on my papers and codebases.";
  const ChatAnswer = "Alex, analyzing your verified credentials against Tesla's ML Engineer requirements: You possess a 94% matching coefficient. Your custom YOLOv8 PPE detection engine at IIT Bombay (achieving 94.2% mAP) matches their deep learning pipelines. However, we detected a gap in CUDA/TensorRT optimization. To hit 100%, I recommend deploying your model with TensorRT engine weights to AWS Lambda container clusters.";

  useEffect(() => {
    runStepSequence();
    return () => {
      clearAllTimers();
    };
  }, [activeStep]);

  const clearAllTimers = () => {
    if (logTimerRef.current) clearInterval(logTimerRef.current);
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
  };

  // State machine sequence controller
  const runStepSequence = () => {
    clearAllTimers();

    if (!autoRun) return;

    if (activeStep === 'boot') {
      stepTimerRef.current = setTimeout(() => {
        setActiveStep('ingest');
      }, 2500);

    } else if (activeStep === 'ingest') {
      setLogStream([]);
      let i = 0;
      logTimerRef.current = setInterval(() => {
        if (i < IngestLogs.length) {
          setLogStream(prev => [...prev, IngestLogs[i]]);
          i++;
        } else {
          clearInterval(logTimerRef.current!);
          stepTimerRef.current = setTimeout(() => {
            setActiveStep('constellation');
          }, 1500);
        }
      }, 350);

    } else if (activeStep === 'constellation') {
      setCurrentTab('graph');
      stepTimerRef.current = setTimeout(() => {
        setActiveStep('digital_twin');
      }, 3000);

    } else if (activeStep === 'digital_twin') {
      setCurrentTab('dashboard');
      stepTimerRef.current = setTimeout(() => {
        setActiveStep('story');
      }, 3500);

    } else if (activeStep === 'story') {
      setCurrentTab('timeline');
      stepTimerRef.current = setTimeout(() => {
        setActiveStep('insight');
      }, 4000);

    } else if (activeStep === 'insight') {
      setCurrentTab('insights');
      stepTimerRef.current = setTimeout(() => {
        setActiveStep('query');
      }, 4500);

    } else if (activeStep === 'query') {
      setCurrentTab('chat');
      setTypingText('');
      let charIdx = 0;
      logTimerRef.current = setInterval(() => {
        if (charIdx < ChatQuery.length) {
          setTypingText(prev => prev + ChatQuery[charIdx]);
          charIdx++;
        } else {
          clearInterval(logTimerRef.current!);
          stepTimerRef.current = setTimeout(() => {
            setActiveStep('cinematic');
          }, 3000);
        }
      }, 35);

    } else if (activeStep === 'cinematic') {
      stepTimerRef.current = setTimeout(() => {
        setActiveStep('complete');
      }, 8500);
    }
  };

  const handleNextStep = () => {
    clearAllTimers();
    const steps: StepType[] = ['boot', 'ingest', 'constellation', 'digital_twin', 'story', 'insight', 'query', 'cinematic', 'complete'];
    const currIdx = steps.indexOf(activeStep);
    if (currIdx < steps.length - 1) {
      setActiveStep(steps[currIdx + 1]);
    } else {
      onClose();
    }
  };

  const handlePrevStep = () => {
    clearAllTimers();
    const steps: StepType[] = ['boot', 'ingest', 'constellation', 'digital_twin', 'story', 'insight', 'query', 'cinematic', 'complete'];
    const currIdx = steps.indexOf(activeStep);
    if (currIdx > 0) {
      setActiveStep(steps[currIdx - 1]);
    }
  };

  const handleSkipDemo = () => {
    clearAllTimers();
    onClose();
  };

  // Steps indicator tracker
  const stepsList: { id: StepType; label: string; icon: any }[] = [
    { id: 'boot', label: 'Systems Boot', icon: Cpu },
    { id: 'ingest', label: 'AI Reasoning Ingest', icon: Activity },
    { id: 'constellation', label: 'Constellation Build', icon: Network },
    { id: 'digital_twin', label: 'Digital Twin Model', icon: Fingerprint },
    { id: 'story', label: 'Story Mode Timeline', icon: History },
    { id: 'insight', label: 'Gaps & Insights', icon: Lightbulb },
    { id: 'query', label: 'Cognitive Chat Query', icon: MessageSquare },
    { id: 'cinematic', label: 'Cinematic Verdict', icon: Sparkles }
  ];

  const currentStepNum = stepsList.findIndex(s => s.id === activeStep) + 1;

  return (
    <div className="fixed inset-0 bg-[#030014]/98 z-50 flex flex-col justify-between overflow-hidden" id="demo-presentation-panel">
      
      {/* Upper Status Progress Ribbon */}
      <div className="bg-[#06021f] border-b border-purple-950/45 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center glow-box-purple">
            <Cpu className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-xs text-white uppercase tracking-wider">HACKATHON DEMO PRESENTATION MODE</h2>
            <p className="text-[10px] text-purple-400 font-mono">AUTOMATED SYSTEM SEQUENCE ACTIVE</p>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {stepsList.map((step, idx) => {
            const isPassed = stepsList.findIndex(s => s.id === activeStep) > idx;
            const isActive = step.id === activeStep;
            return (
              <React.Fragment key={step.id}>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[10px] font-mono transition-all duration-300 ${
                  isPassed 
                    ? 'bg-emerald-950/15 border-emerald-900/30 text-emerald-400' 
                    : isActive 
                      ? 'bg-purple-950/30 border-purple-500 text-purple-300' 
                      : 'bg-black/20 border-white/5 text-gray-500'
                }`}>
                  <step.icon className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse text-purple-400' : ''}`} />
                  <span>{step.label}</span>
                </div>
                {idx < stepsList.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Presentation Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setAutoRun(!autoRun)}
            className="px-3 py-1.5 bg-purple-950/20 border border-purple-900/30 rounded-xl text-[10px] font-mono text-purple-300 hover:bg-purple-950/40"
          >
            {autoRun ? '⏹️ MANUAL CONTROL' : '▶️ RESUME AUTOPLAY'}
          </button>
          <button 
            onClick={handleSkipDemo}
            className="px-3.5 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 rounded-xl text-[10px] font-mono text-red-300"
          >
            SKIP DEMO
          </button>
        </div>
      </div>

      {/* Main Content Stage Viewports */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        
        {/* Animated matrix streams */}
        <div className="absolute inset-0 bg-radial-grid opacity-10 pointer-events-none"></div>

        {/* STEP 1: SYSTEMS BOOT */}
        {activeStep === 'boot' && (
          <div className="text-center space-y-5 animate-fade-in max-w-lg">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500 animate-spin"></span>
              <Fingerprint className="w-10 h-10 text-purple-400 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h1 className="font-display font-black text-2xl text-white uppercase tracking-tight">Initializing LifeGraph AI</h1>
              <p className="text-xs text-purple-400 font-mono">LOADING COGNITIVE IDENTITY SYNAPSE MATRICES...</p>
            </div>
            <p className="text-xs text-gray-400 font-sans max-w-sm mx-auto leading-relaxed">
              We are connecting academic transcripts, code repositories, research papers, and certificates for user <strong className="text-white">Alex Mercer</strong>.
            </p>
          </div>
        )}

        {/* STEP 2: ACTIVE AI REASONING INGEST */}
        {activeStep === 'ingest' && (
          <div className="w-full max-w-2xl bg-black/40 border border-purple-950/30 p-6 rounded-3xl space-y-5 animate-fade-in">
            <div className="flex justify-between items-center border-b border-purple-950/25 pb-3">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-purple-400 animate-spin" />
                <div>
                  <h3 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">Active AI Reasoning Pipeline</h3>
                  <span className="text-[9px] font-mono text-purple-400">OCR & EMBD STREAMING</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded font-bold">PIPELINE SECURE</span>
            </div>

            {/* Simulated Live Terminal Logs */}
            <div className="h-56 bg-[#040114] border border-purple-950/40 rounded-2xl p-4 font-mono text-[11px] overflow-y-auto space-y-1.5 text-gray-400">
              {logStream.map((log, idx) => (
                <div key={idx} className="animate-fade-in flex items-start gap-2 text-purple-300">
                  <span className="text-purple-500 shrink-0">&gt;&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              {logStream.length < IngestLogs.length && (
                <div className="text-purple-400 animate-pulse">&gt;&gt; Analyzing pipeline indices... <span className="inline-block w-1.5 h-3.5 bg-purple-500 align-middle"></span></div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: CONSTELLATION BUILD */}
        {activeStep === 'constellation' && (
          <div className="text-center space-y-4 animate-fade-in max-w-lg">
            <div className="p-3.5 bg-purple-950/25 border border-purple-500/30 rounded-full w-fit mx-auto animate-bounce">
              <Network className="w-10 h-10 text-purple-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">Drawing Memory Constellation</h2>
              <p className="text-xs text-purple-400 font-mono">CONVERTING FILES INTO CELESTIAL SYNAPSE LINKS</p>
            </div>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              Every certificate, project, and leadership milestone is structured into a dynamic, physics-driven force-directed SVG star galaxy. Watch nodes establish orbital paths around competency hubs.
            </p>
          </div>
        )}

        {/* STEP 4: AI DIGITAL TWIN COMPILATION */}
        {activeStep === 'digital_twin' && (
          <div className="text-center space-y-4 animate-fade-in max-w-lg">
            <div className="p-3.5 bg-blue-950/25 border border-blue-500/30 rounded-full w-fit mx-auto animate-pulse">
              <Fingerprint className="w-10 h-10 text-blue-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">Compiling AI Digital Twin</h2>
              <p className="text-xs text-blue-400 font-mono">HARVESTING IDENTITY ARCHETYPES</p>
            </div>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              Synthesizing Alex Mercer's professional identity. Calculating key indices: Technical Maturity: 94%, Synaptic Links: 28, growth rate: Exponential. Archetype identified: Applied AI & Computer Vision Architect.
            </p>
          </div>
        )}

        {/* STEP 5: STORY MODE */}
        {activeStep === 'story' && (
          <div className="text-center space-y-4 animate-fade-in max-w-lg">
            <div className="p-3.5 bg-rose-950/25 border border-rose-500/30 rounded-full w-fit mx-auto animate-pulse">
              <History className="w-10 h-10 text-rose-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">Unfolding Cinematic Story Mode</h2>
              <p className="text-xs text-rose-400 font-mono">CHRONOLOGIZING MILESTONES WITH INTENSITY</p>
            </div>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              Rather than a static list of dates, LifeGraph narrates your journey, highlighting verified impact milestones sequentially from 2023 to 2026.
            </p>
          </div>
        )}

        {/* STEP 6: INSIGHTS & GAPS */}
        {activeStep === 'insight' && (
          <div className="text-center space-y-4 animate-fade-in max-w-lg">
            <div className="p-3.5 bg-amber-950/25 border border-amber-500/30 rounded-full w-fit mx-auto animate-pulse">
              <Lightbulb className="w-10 h-10 text-amber-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">Analyzing Anomalies & Career Forecasts</h2>
              <p className="text-xs text-amber-400 font-mono">GAPS DETECTED AT COGNITIVE BOUNDARIES</p>
            </div>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              Our forecast engine automatically identifies career readiness levels for Machine Learning, CV Scientist, and Web Architect positions, matching technologies and identifying evidence gaps dynamically.
            </p>
          </div>
        )}

        {/* STEP 7: COGNITIVE CHAT QUERY */}
        {activeStep === 'query' && (
          <div className="w-full max-w-2xl bg-[#090424]/85 border border-purple-500/30 p-6 rounded-3xl space-y-5 animate-fade-in relative">
            <div className="flex items-center gap-2 border-b border-purple-950/25 pb-3">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="font-display font-extrabold text-xs text-white uppercase tracking-wider">Simulating Natural Language Verification</h3>
                <span className="text-[9px] font-mono text-purple-400">COGNITIVE VERIFICATION CONSOLE</span>
              </div>
            </div>

            {/* Simulated typing query */}
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-purple-950/20 border border-purple-900/30 p-3.5 rounded-2xl">
                <span className="text-[9px] font-mono text-purple-400 uppercase tracking-wider block font-bold mb-1">User Query</span>
                <p className="text-white text-xs font-mono font-semibold">{typingText}<span className="inline-block w-1.5 h-3.5 bg-white align-middle animate-pulse"></span></p>
              </div>

              {typingText.length === ChatQuery.length && (
                <div className="bg-black/40 border border-purple-950/35 p-4 rounded-2xl animate-fade-in space-y-2">
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">LifeGraph AI Response</span>
                  <p className="text-gray-300 leading-relaxed font-sans">{ChatAnswer}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 8: THE CINEMATIC SPEECH VERDICT */}
        {activeStep === 'cinematic' && (
          <div className="text-center space-y-8 animate-fade-in select-none px-4">
            
            <div className="space-y-6">
              {/* Line 1 */}
              <div className="h-10 overflow-hidden relative">
                <div className="text-lg md:text-2xl font-serif text-white tracking-widest leading-none font-light animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  "I didn't organize your files."
                </div>
              </div>

              {/* Line 2 */}
              <div className="h-10 overflow-hidden relative">
                <div className="text-lg md:text-2xl font-serif text-white tracking-widest leading-none font-light animate-fade-in-up" style={{ animationDelay: '3.0s' }}>
                  "I reconstructed your journey."
                </div>
              </div>

              {/* Line 3 */}
              <div className="h-10 overflow-hidden relative">
                <div className="text-lg md:text-2xl font-serif text-purple-400 tracking-widest leading-none font-medium animate-fade-in-up" style={{ animationDelay: '5.5s' }}>
                  "And now I can help shape your future."
                </div>
              </div>
            </div>

            {/* Glowing particle burst simulation */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-purple-500/5 via-transparent to-transparent pointer-events-none animate-pulse"></div>

          </div>
        )}

        {/* STEP 9: COMPLETE AND UNLOCKED */}
        {activeStep === 'complete' && (
          <div className="text-center space-y-6 animate-fade-in max-w-sm">
            <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">Presentation Unlocked</h2>
              <p className="text-xs text-emerald-400 font-mono uppercase tracking-widest font-bold">DIGITAL IDENTITY DEPLOYED</p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              The complete LifeGraph AI demonstration sequence is finished. Reviewers can now interactively explore all systems, cards, and clusters natively!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs font-bold text-white rounded-xl shadow-[0_0_15px_#8b5cf6] cursor-pointer flex items-center gap-1.5 mx-auto"
            >
              Explore Sandbox Environment <LogIn className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Presentation Footer controllers */}
      <div className="bg-[#06021f] border-t border-purple-950/45 px-6 py-4 flex justify-between items-center z-10">
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
          CHAPTER {currentStepNum} OF {stepsList.length} &bull; COGNITIVE TIMELINE MODEL
        </span>

        <div className="flex items-center gap-2">
          {activeStep !== 'boot' && (
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 bg-purple-950/20 border border-purple-900/30 text-xs font-mono rounded-xl text-purple-300 hover:bg-purple-900/30 cursor-pointer"
            >
              &lt; PREVIOUS STEP
            </button>
          )}

          {activeStep !== 'complete' ? (
            <button
              onClick={handleNextStep}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs font-mono font-bold rounded-xl text-white cursor-pointer flex items-center gap-1"
            >
              NEXT DEMO STAGE <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-xs font-mono font-bold rounded-xl text-white cursor-pointer"
            >
              CLOSE PRESENTATION
            </button>
          )}
        </div>
      </div>

      {/* Embedded keyframe CSS for cinematic text transitions and backgrounds */}
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .bg-radial-grid {
          background-image: linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
