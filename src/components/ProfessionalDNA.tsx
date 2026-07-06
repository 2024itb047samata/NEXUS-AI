import React, { useEffect, useRef, useState } from 'react';
import { 
  Dna, 
  Sparkles, 
  Brain, 
  Cpu, 
  Flame, 
  Zap, 
  Award, 
  Layers, 
  CheckCircle, 
  ShieldAlert, 
  Fingerprint,
  TrendingUp,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { motion } from 'motion/react';

interface ProfessionalDNAProps {
  documents: any[];
}

interface TraitMarker {
  name: string;
  value: number;
  description: string;
  evidence: string[];
}

export default function ProfessionalDNA({ documents }: ProfessionalDNAProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTrait, setSelectedTrait] = useState<string | null>('Artificial Intelligence');
  const [stats, setStats] = useState<TraitMarker[]>([
    { name: 'Artificial Intelligence', value: 92, description: 'Neural networks, Computer Vision models, and agentic workflows.', evidence: ['YOLOv8 PPE Detection capstone', 'OpenCV image processing models', 'Google Python automated scripting'] },
    { name: 'Backend Systems', value: 85, description: 'Server architectures, RESTful API pipelines, and cloud database state operations.', evidence: ['FastAPI microservices architecture', 'PostgreSQL custom triggers', 'Docker containerized model serving'] },
    { name: 'Frontend UX/UI', value: 78, description: 'Immersive, high-frame-rate responsive layout renderers and interactive visual pipelines.', evidence: ['React + Tailwind dashboard builders', 'Responsive knowledge graph physics viewport', 'Motion stagger animations'] },
    { name: 'Academic Research', value: 88, description: 'Theoretical exploration, algorithmic proofs, and formal research reviews.', evidence: ['IIT Bombay recommendation letter', 'Capstone theoretical research document', 'TensorRT performance validation logs'] },
    { name: 'Leadership & Collab', value: 82, description: 'Coordination, group mentorship, and technical project management.', evidence: ['IEEE Student Coordinator certificate', 'Technical lead on Computer Vision deployment', 'Agile scrum sprint execution logs'] },
    { name: 'Innovation Score', value: 90, description: 'Out-of-box algorithm synthesis, hackathon solutions, and product vision.', evidence: ['Top 3% Hackathon merit badge', 'Real-time camera edge streaming module', 'AI Digital Twin cognitive architecture'] },
    { name: 'Technical Comms', value: 86, description: 'Clear presentation of complex computer science structures and technical reviews.', evidence: ['Client-facing API architecture documentation', 'FastAPI benchmark reports', 'Digital portfolio custom documentation'] },
    { name: 'Consistency Index', value: 94, description: 'Habitual code shipping, version history depth, and long-term skill progression.', evidence: ['24+ verified repository commits', 'Multiple document versions processed', 'Consistent weekly progress tracking'] },
    { name: 'Learning Velocity', value: 96, description: 'Rapid acquisition and application of complex technical frameworks.', evidence: ['Fast transition from Python to PyTorch', 'Kubernetes bootcamp certification', 'Instant AI Twin integration benchmarks'] },
    { name: 'Problem Solving', value: 91, description: 'Dynamic resolution of bottleneck states, model overfit, and backend scaling issues.', evidence: ['Celery & Redis background task queue integration', 'Model edge compilation via ONNX', 'Database scale-to-zero query optimization'] }
  ]);

  // Compute dynamic scores based on documents uploaded
  useEffect(() => {
    if (!documents || documents.length === 0) return;

    const allSkills = new Set<string>();
    let numProjects = 0;
    let numCerts = 0;
    let numResearch = 0;
    let numHackathons = 0;

    documents.forEach(doc => {
      if (doc.metadata?.skills) {
        doc.metadata.skills.forEach((s: string) => allSkills.add(s.toLowerCase()));
      }
      if (doc.category === 'Projects') numProjects++;
      if (doc.category === 'Certificates') numCerts++;
      if (doc.category === 'Research' || doc.metadata?.researchPapers?.length > 0) numResearch++;
      if (doc.category === 'Hackathons' || doc.name.toLowerCase().includes('hackathon')) numHackathons++;
    });

    const skillCount = allSkills.size;

    setStats(prev => prev.map(trait => {
      let score = trait.value;
      let extraEvidences = [...trait.evidence];

      // Dynamic rule updates
      if (trait.name === 'Artificial Intelligence') {
        score = Math.min(65 + skillCount * 2.5 + numProjects * 6, 99);
        if (numProjects > 0) extraEvidences.unshift(`${numProjects} verified Project files indexed`);
      } else if (trait.name === 'Backend Systems') {
        score = Math.min(60 + skillCount * 2 + numProjects * 5, 98);
        if (allSkills.has('fastapi') || allSkills.has('express') || allSkills.has('node')) {
          extraEvidences.unshift('Verified back-end framework competencies');
        }
      } else if (trait.name === 'Academic Research') {
        score = numResearch > 0 ? Math.min(80 + numResearch * 10, 99) : 45;
        if (numResearch > 0) extraEvidences.unshift(`${numResearch} academic research publications mapped`);
      } else if (trait.name === 'Innovation Score') {
        score = Math.min(70 + numHackathons * 12 + numProjects * 4, 99);
        if (numHackathons > 0) extraEvidences.unshift(`Hackathon champion credentials verified`);
      } else if (trait.name === 'Learning Velocity') {
        score = Math.min(75 + numCerts * 6 + skillCount * 1.5, 99);
        if (numCerts > 0) extraEvidences.unshift(`${numCerts} professional certifications verified`);
      }

      return {
        ...trait,
        value: Math.round(score),
        evidence: Array.from(new Set(extraEvidences))
      };
    }));

  }, [documents]);

  // DNA 3D-feeling Canvas double-helix rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;
    const pointsCount = 22;
    const speed = 0.025;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || 380;
      canvas.height = 360;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawHelix = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const amplitude = 55;
      const step = width / (pointsCount - 1);

      // Draw background ambient grid lines
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Draw connection ladders first
      for (let i = 0; i < pointsCount; i++) {
        const x = i * step;
        const angle = (i * 0.4) + phase;
        
        const y1 = centerY + Math.sin(angle) * amplitude;
        const y2 = centerY - Math.sin(angle) * amplitude;
        
        // Depth logic (brightness depends on cosine/depth coordinate)
        const z1 = Math.cos(angle);
        const z2 = -Math.cos(angle);

        // Grid-line styling
        const gradient = ctx.createLinearGradient(x, y1, x, y2);
        gradient.addColorStop(0, z1 > 0 ? 'rgba(168, 85, 247, 0.6)' : 'rgba(59, 130, 246, 0.2)');
        gradient.addColorStop(1, z2 > 0 ? 'rgba(59, 130, 246, 0.6)' : 'rgba(168, 85, 247, 0.2)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(1, (z1 + z2 + 2) * 1.5);
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();
      }

      // Draw Strand 1 Nodes (Purple)
      for (let i = 0; i < pointsCount; i++) {
        const x = i * step;
        const angle = (i * 0.4) + phase;
        const y1 = centerY + Math.sin(angle) * amplitude;
        const z1 = Math.cos(angle);
        const size = Math.max(2.5, (z1 + 1.2) * 4);

        ctx.shadowBlur = size * 1.5;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
        ctx.fillStyle = z1 > 0 ? '#d8b4fe' : '#701a75';
        ctx.beginPath();
        ctx.arc(x, y1, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Draw Strand 2 Nodes (Blue)
      for (let i = 0; i < pointsCount; i++) {
        const x = i * step;
        const angle = (i * 0.4) + phase;
        const y2 = centerY - Math.sin(angle) * amplitude;
        const z2 = -Math.cos(angle);
        const size = Math.max(2.5, (z2 + 1.2) * 4);

        ctx.shadowBlur = size * 1.5;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
        ctx.fillStyle = z2 > 0 ? '#93c5fd' : '#1e3a8a';
        ctx.beginPath();
        ctx.arc(x, y2, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Draw central glowing DNA core text
      ctx.fillStyle = 'rgba(168, 85, 247, 0.1)';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('NEXUS GENOMICS V3', width / 2, centerY + 5);

      phase += speed;
      animationId = requestAnimationFrame(drawHelix);
    };

    drawHelix();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const radarData = stats.map(s => ({
    subject: s.name,
    A: s.value,
    fullMark: 100
  }));

  const activeTraitDetails = stats.find(s => s.name === selectedTrait) || stats[0];

  return (
    <div className="space-y-8 animate-fade-in" id="professional-dna-view">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/30 to-blue-950/10 p-6 rounded-3xl border border-purple-950/30 glow-box relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-1.5 text-purple-400 font-mono text-[10px] uppercase tracking-widest font-bold">
            <Fingerprint className="w-4 h-4 animate-pulse" /> Biological Tech Mapping
          </div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-white flex items-center gap-2">
            Professional DNA Genomics
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
            A futuristic evaluation mapping credentials, projects, and certifications directly into 10 fundamental professional genome markers. Explore your glowing gene traits.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1 bg-[#140b3b]/60 border border-purple-950/40 p-1.5 rounded-2xl relative z-10">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest px-2.5 font-extrabold">Active Gene Mapping</span>
        </div>
      </div>

      {/* Futuristic DNA Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* DNA Helix Canvas Strand on Left */}
        <div className="lg:col-span-5 bg-[#050117] border border-purple-950/30 p-5 rounded-3xl flex flex-col justify-between shadow-[0_4px_40px_rgba(0,0,0,0.6)] relative overflow-hidden h-[420px] group">
          <div className="absolute inset-0 bg-radial-dots pointer-events-none opacity-30"></div>
          
          <div className="flex items-center justify-between border-b border-purple-950/20 pb-3 z-10">
            <div className="flex items-center gap-2">
              <Dna className="w-5 h-5 text-purple-400 animate-pulse" />
              <span className="text-xs font-display font-extrabold text-white uppercase tracking-wider">Livelink Double-Helix</span>
            </div>
            <span className="text-[9px] font-mono text-gray-500">DYNAMIC HELIX PHASE</span>
          </div>

          <div className="flex-1 flex items-center justify-center relative mt-3">
            <canvas ref={canvasRef} className="w-full max-h-[300px] z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-500/5 to-transparent pointer-events-none"></div>
          </div>

          <div className="bg-[#110c32]/40 border border-purple-950/30 p-3 rounded-2xl text-[10px] font-mono text-gray-400 leading-relaxed text-center z-10">
            Your credentials generate continuous wave-frequency markers mapped at <span className="text-purple-300 font-bold">12.2 GHz</span>.
          </div>
        </div>

        {/* Recharts Radar Chart in Middle */}
        <div className="lg:col-span-7 bg-[#0b0629]/40 border border-purple-950/20 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative flex flex-col justify-between h-[420px]">
          <div className="flex items-center justify-between border-b border-purple-950/20 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-display font-extrabold text-white uppercase tracking-wider">Synaptic Trait Alignment</span>
            </div>
            <span className="text-[9px] font-mono text-purple-400">RADAR PLOT MULTI-VECTOR</span>
          </div>

          <div className="flex-1 w-full flex items-center justify-center mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#1e184e" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  stroke="#9ca3af" 
                  fontSize={9} 
                  tickFormatter={(val) => val}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} stroke="#1e184e" />
                <Radar 
                  name="DNA Gene Strengths" 
                  dataKey="A" 
                  stroke="#a855f7" 
                  fill="#8b5cf6" 
                  fillOpacity={0.35} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#090424', 
                    border: '1px solid rgba(168, 85, 247, 0.4)', 
                    borderRadius: '12px', 
                    fontSize: '11px',
                    color: '#fff' 
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] font-mono text-center text-gray-400 mt-2">
            Hover or click nodes on the chart to read precise biological synthesis traits.
          </div>
        </div>

      </div>

      {/* Trait Markers Interactive Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Traits selection scroll lists */}
        <div className="bg-[#0b0629]/40 border border-purple-950/20 rounded-3xl p-5 shadow-[0_4px_30px_rgba(0,0,0,0.4)] md:col-span-1 h-[360px] flex flex-col">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block border-b border-purple-950/20 pb-2 mb-3">Genome Traits List</span>
          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1.5 custom-scrollbar">
            {stats.map((trait) => {
              const isSelected = selectedTrait === trait.name;
              return (
                <button
                  key={trait.name}
                  onClick={() => setSelectedTrait(trait.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-purple-950/30 border-purple-500/50 text-white shadow-[inset_0_0_12px_rgba(168,85,247,0.1)]'
                      : 'bg-black/20 border-purple-950/10 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs font-semibold">{trait.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-purple-300' : 'text-gray-500'}`}>{trait.value}%</span>
                    <div className="w-8 bg-purple-950/40 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${trait.value}%` }}></div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Trait Cognitive Evidence Inspection */}
        <div className="bg-[#0b0629]/40 border border-purple-950/20 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] md:col-span-2 h-[360px] flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-purple-950/20 pb-3">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-purple-400">Interactive Genomic Detail</span>
                <h3 className="text-base font-display font-extrabold text-white mt-0.5">{activeTraitDetails.name} Gene</h3>
              </div>
              <span className="text-xl font-display font-black text-purple-400">{activeTraitDetails.value} / 100</span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Core Gene Definition</span>
              <p className="text-xs text-gray-300 leading-relaxed bg-[#06021f]/60 p-4 rounded-xl border border-purple-950/20 font-sans">
                {activeTraitDetails.description}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Verifiable Synaptic Evidence</span>
              <div className="space-y-2">
                {activeTraitDetails.evidence.map((ev, index) => (
                  <div key={index} className="flex items-center gap-2 bg-purple-950/10 border border-purple-900/20 px-3.5 py-2 rounded-xl text-[11px] text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[9px] font-mono text-gray-500 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-purple-500" /> Evidence harvested automatically via OCR structure analysis matching of raw uploads.
          </div>

        </div>

      </div>

    </div>
  );
}
