import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  Play, 
  Send, 
  Cpu, 
  Award, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  RotateCcw, 
  User, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Timer, 
  ArrowRight,
  Sparkle
} from 'lucide-react';
import { motion } from 'motion/react';

interface AIInterviewerProps {
  documents: any[];
}

interface QuestionHistoryItem {
  question: string;
  answer: string;
  feedback: string;
  rating: number;
}

export default function AIInterviewer({ documents }: AIInterviewerProps) {
  const [sessionActive, setSessionActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [answer, setAnswer] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);
  const [currentRating, setCurrentRating] = useState<number | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [currentAlternate, setCurrentAlternate] = useState('');
  const [history, setHistory] = useState<QuestionHistoryItem[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes per question
  const [interviewerPersona, setInterviewerPersona] = useState({
    name: 'Dr. Evelyn Carter',
    role: 'Principal SpaceX Avionics Architect & Ex-Google Staff',
    avatarGlow: 'from-rose-500/30 to-purple-500/30',
    avatarText: 'EC',
    traits: ['Demanding', 'Systems Thinker', 'Strict Metrics']
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound Synth for futuristic beep-boops when answering
  const playBeep = (freq = 440, type: OscillatorType = 'sine', dur = 0.1) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (e) {
      // ignore audio context failures in sandbox iframe
    }
  };

  // Timer logic
  useEffect(() => {
    if (sessionActive && timeLeft > 0 && !ratingLoading && !currentRating) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionActive, timeLeft, ratingLoading, currentRating]);

  const startInterviewSession = async () => {
    playBeep(587.33, 'triangle', 0.25); // D5
    setSessionActive(true);
    setHistory([]);
    fetchNextQuestion([]);
  };

  const fetchNextQuestion = async (currentHistory = history) => {
    setLoading(true);
    setAnswer('');
    setCurrentRating(null);
    setCurrentFeedback('');
    setCurrentAlternate('');
    setTimeLeft(180);

    try {
      const res = await fetch('/api/interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: currentHistory })
      });
      const data = await res.json();
      setCurrentQuestion(data.question);
      setFocusArea(data.focusArea);
      setDifficulty(data.difficulty);
      playBeep(493.88, 'sine', 0.15); // B4
    } catch (err) {
      console.error('Error fetching question:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || ratingLoading) return;
    setRatingLoading(true);
    playBeep(659.25, 'sawtooth', 0.1); // E5

    try {
      const res = await fetch('/api/interview/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion, answer })
      });
      const data = await res.json();
      setCurrentRating(data.rating);
      setCurrentFeedback(data.feedback);
      setCurrentAlternate(data.alternateAnswer);

      // Save to history
      const newHistoryItem: QuestionHistoryItem = {
        question: currentQuestion,
        answer,
        feedback: data.feedback,
        rating: data.rating
      };
      
      const updatedHistory = [...history, newHistoryItem];
      setHistory(updatedHistory);

      if (data.rating >= 85) {
        playBeep(880, 'sine', 0.3); // A5 high beep (Success)
      } else {
        playBeep(349.23, 'sawtooth', 0.4); // F3 low buzz (Failure/tough review)
      }
    } catch (err) {
      console.error('Error rating answer:', err);
    } finally {
      setRatingLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Interview Ledger metrics
  const totalQuestions = history.length;
  const averageRating = totalQuestions > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.rating, 0) / totalQuestions)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in" id="ai-interviewer-root">
      
      {/* Dynamic Title / Selector Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-rose-950/25 to-purple-950/15 p-6 rounded-3xl border border-rose-950/20 glow-box relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[10px] uppercase tracking-widest font-bold">
            <Cpu className="w-4 h-4 text-rose-500 animate-pulse" /> SpaceX & Google Board simulation
          </div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-white flex items-center gap-2">
            AI Rigorous Technical Interviewer
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
            Simulate a high-stress technical board review. The AI leverages your uploaded project credentials and certification PDFs to probe edge latency, code flaws, and system bottlenecks.
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-3 py-1.5 rounded-xl border font-mono text-[10px] uppercase font-bold cursor-pointer transition-all flex items-center gap-1.5 relative z-10 ${
            soundEnabled 
              ? 'bg-rose-950/20 border-rose-900/30 text-rose-400' 
              : 'bg-black/20 border-gray-800 text-gray-500'
          }`}
          id="btn-toggle-interview-sound"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>Synth Audio: {soundEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {!sessionActive ? (
        // Launch Screen
        <div className="bg-[#050117] border border-rose-950/30 rounded-3xl p-8 shadow-[0_4px_40px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col items-center justify-center text-center space-y-6 min-h-[380px]" id="interview-launch-screen">
          <div className="absolute inset-0 bg-radial-dots pointer-events-none opacity-20"></div>
          
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-rose-500 to-purple-600 p-[1.5px] shadow-[0_0_24px_rgba(244,63,94,0.3)] animate-pulse">
            <div className="w-full h-full bg-[#090424] rounded-full flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-rose-400" />
            </div>
          </div>

          <div className="space-y-2 max-w-lg relative z-10">
            <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">Board Director Carter is Ready</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Dr. Evelyn Carter holds zero tolerance for boilerplate code or standard hand-waving answers. She will inspect your Capstones, YOLOv8 implementations, and FastAPI architectures. You have 3 minutes per question.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 py-2">
            {interviewerPersona.traits.map(t => (
              <span key={t} className="text-[9px] font-mono font-bold bg-rose-950/30 border border-rose-900/20 text-rose-400 px-3 py-1 rounded-xl uppercase tracking-wider">{t}</span>
            ))}
          </div>

          <button
            onClick={startInterviewSession}
            className="px-6 py-3 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-xs font-bold rounded-2xl text-white transition-all shadow-[0_4px_14px_rgba(244,63,94,0.4)] cursor-pointer flex items-center gap-2"
            id="btn-launch-interview"
          >
            <Play className="w-4 h-4 fill-white" /> Initiate Strategic Board Interview
          </button>
        </div>
      ) : (
        // Active Interview Session
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Interview Panel Main Interactive Board */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Question Card Display */}
            <div className="bg-[#0b0629]/40 border border-rose-950/20 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative">
              
              <div className="flex items-center justify-between border-b border-rose-950/20 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${interviewerPersona.avatarGlow} flex items-center justify-center font-bold font-mono text-xs text-white border border-rose-500/20`}>
                    {interviewerPersona.avatarText}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-widest">{interviewerPersona.role}</span>
                    <h4 className="text-xs font-display font-bold text-white mt-0.5">{interviewerPersona.name}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-black/40 border border-rose-950/30 px-3 py-1.5 rounded-xl text-xs font-mono text-rose-400">
                  <Timer className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin"></div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Carter is parsing your background credentials...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-950/40 border border-rose-900/30 text-rose-400">{focusArea}</span>
                    <span className="text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-950/40 border border-purple-900/30 text-purple-300">{difficulty} Difficulty</span>
                  </div>
                  <p className="text-sm font-sans text-gray-200 leading-relaxed bg-[#050117] border border-rose-950/20 p-4.5 rounded-2xl italic">
                    "{currentQuestion}"
                  </p>
                </div>
              )}

            </div>

            {/* Answer Box and Submit */}
            <div className="bg-[#0b0629]/40 border border-rose-950/20 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] space-y-4">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Candidate Technical Response Input</span>
              
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={loading || ratingLoading || !!currentRating}
                placeholder="Describe your design choices, database locks, cache strategies, layers, and concrete metrics..."
                className="w-full h-32 bg-black/40 border border-rose-950/30 focus:border-rose-500/50 rounded-2xl p-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-0 resize-none font-sans leading-relaxed"
                id="interview-answer-textarea"
              />

              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-gray-500">Provide deep math, pruning, and load stats to score higher.</span>
                
                {!currentRating ? (
                  <button
                    onClick={submitAnswer}
                    disabled={!answer.trim() || ratingLoading || loading}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-30 text-xs font-bold rounded-xl text-white transition-all cursor-pointer flex items-center gap-1.5"
                    id="btn-submit-answer"
                  >
                    {ratingLoading ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmit Technical Answer</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => fetchNextQuestion()}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-xs font-bold rounded-xl text-white transition-all cursor-pointer flex items-center gap-1.5"
                    id="btn-next-question"
                  >
                    <span>Request Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Live Real-time Rating Evaluation Card */}
            {currentRating && (
              <div className="bg-[#0b0629]/50 border border-purple-950/30 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] space-y-5 animate-slide-up" id="rating-result-card">
                <div className="flex items-center justify-between border-b border-purple-950/20 pb-3">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-purple-400">Board Evaluation Scorecard</span>
                    <h4 className="text-xs font-display font-extrabold text-white mt-0.5">Critical Evaluation Report</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-400">Panel Score:</span>
                    <span className={`text-lg font-display font-black ${currentRating >= 85 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {currentRating}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Carter's Hard Critique</span>
                  <p className="text-xs text-gray-300 leading-relaxed bg-[#06021f] p-4 border border-purple-950/30 rounded-2xl">
                    {currentFeedback}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Elite Senior Architect Standard Ledger</span>
                  <p className="text-xs text-emerald-300 leading-relaxed bg-emerald-950/10 p-4 border border-emerald-900/20 rounded-2xl font-mono">
                    {currentAlternate}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Session Progress & Engineering Feedback Ledger on Right */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Mini DashboardStats */}
            <div className="bg-[#0b0629]/40 border border-rose-950/20 rounded-3xl p-5 shadow-[0_4px_30px_rgba(0,0,0,0.4)] text-center space-y-3">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Interviev Status Summary</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 p-3 rounded-2xl border border-rose-950/10">
                  <span className="text-lg font-display font-black text-rose-400">{totalQuestions}</span>
                  <span className="text-[8px] font-mono text-gray-500 block uppercase mt-0.5">Completed</span>
                </div>

                <div className="bg-black/30 p-3 rounded-2xl border border-rose-950/10">
                  <span className="text-lg font-display font-black text-purple-400">{averageRating}%</span>
                  <span className="text-[8px] font-mono text-gray-500 block uppercase mt-0.5">Avg Rating</span>
                </div>
              </div>

              {totalQuestions > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-rose-300">
                    Status: {averageRating >= 85 ? '🌟 PASSED BOARD DIRECTIVE' : '⚠️ NEED TECHNICAL DEPTH'}
                  </span>
                </div>
              )}
            </div>

            {/* Completed Questions Ledger */}
            <div className="bg-[#0b0629]/40 border border-rose-950/20 rounded-3xl p-5 shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex-1 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block border-b border-rose-950/25 pb-2 mb-3">Response Ledger</span>
                
                {history.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 text-xs">
                    No completed questions yet. Answer Dr. Carter's first challenge.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1.5 custom-scrollbar">
                    {history.map((h, i) => (
                      <div key={i} className="bg-black/20 p-3 rounded-xl border border-rose-950/10 space-y-1.5 text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono text-rose-400 font-bold">Challenge #{i + 1}</span>
                          <span className={`text-[10px] font-mono font-bold ${h.rating >= 85 ? 'text-emerald-400' : 'text-rose-400'}`}>{h.rating}%</span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate italic">"{h.question}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setSessionActive(false)}
                className="w-full mt-4 py-2 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 text-[10px] font-semibold rounded-xl text-rose-300 transition-all cursor-pointer flex items-center justify-center gap-1"
                id="btn-terminate-interview"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Terminate Directive
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
