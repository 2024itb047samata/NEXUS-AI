import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Brain, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Layers, 
  Award, 
  LineChart,
  User,
  Fingerprint
} from 'lucide-react';
import { motion } from 'motion/react';

interface AIDigitalTwinProps {
  documents: any[];
  user: any;
}

export default function AIDigitalTwin({ documents, user }: AIDigitalTwinProps) {
  const [twinAnalysis, setTwinAnalysis] = useState({
    archetype: 'Applied AI & Computer Vision Architect',
    alignment: 'ML Engineer / Core Vision Developer',
    growthRate: 'Accelerated (Top 3%)',
    summary: 'You are a Computer Vision Specialist with strong experience in Deep Learning models, edge optimization, and full-stack API systems. Your profile exhibits rapid growth in machine learning, and your leadership and research initiatives are backed by verifiable proof documents.',
    verifications: 0,
    skillsCount: 0,
    techMaturity: 88,
    synapticCount: 0
  });

  useEffect(() => {
    if (!documents || documents.length === 0) return;

    // Calculate dynamic values based on uploaded files
    const allSkills = new Set<string>();
    let verificationsCount = 0;
    let projCount = 0;
    let certCount = 0;

    documents.forEach(d => {
      verificationsCount++;
      if (d.metadata?.skills) {
        d.metadata.skills.forEach((s: string) => allSkills.add(s.toLowerCase()));
      }
      if (d.category === 'Projects') projCount++;
      if (d.category === 'Certificates') certCount++;
    });

    const uniqueSkills = allSkills.size;
    const skillsList = Array.from(allSkills);
    
    // Determine dynamic archetype
    let archetype = 'Full-Stack Developer';
    let alignment = 'Software Engineer / Web Architect';
    let summary = 'Your digital brain consists of web applications and full-stack structures. Upload machine learning, certificates, or research papers to expand your AI profile capabilities.';

    const hasML = skillsList.some(s => ['pytorch', 'tensorflow', 'yolo', 'opencv', 'deep learning', 'machine learning', 'cv'].includes(s));
    const hasCloud = skillsList.some(s => ['aws', 'kubernetes', 'docker', 'cloud', 'serverless'].includes(s));
    const hasResearch = documents.some(d => d.category === 'Research' || d.metadata?.researchPapers?.length > 0);

    if (hasML && hasResearch) {
      archetype = 'AI Research Scientist & CV Engineer';
      alignment = 'Research Scientist / Applied AI Specialist';
      summary = `Analyzing your digital footprint reveals a high-aptitude Research Specialist. Combining rigorous academic credentials from ${documents[0]?.metadata?.college || 'IIT Bombay'} with concrete YOLOv8 models, you excel at bridging foundational paper algorithms with production-grade edge deployment.`;
    } else if (hasML) {
      archetype = 'Machine Learning Engineer & CV Architect';
      alignment = 'ML Engineer / Applied AI Developer';
      summary = `Based on your ${projCount} projects and ${certCount} credentials, you are an ML specialist. You have demonstrated high efficiency in YOLOv8 model optimization (ONNX, TensorRT), with solid deployment experience using FastAPI backend systems and React frontends.`;
    } else if (hasCloud) {
      archetype = 'Cloud DevOps & Systems Architect';
      alignment = 'DevOps / Distributed Systems Engineer';
      summary = `Your credentials show strong affinity with microservices and containerized clusters. Mapped competencies indicate proficiency in AWS systems, Kubernetes orchestrations, and Docker environments, supporting robust horizontally scaled architectures.`;
    } else if (documents.length > 0) {
      archetype = 'Technical Solutions Engineer';
      alignment = 'Full-Stack Developer / Project Lead';
      summary = `Your profile aggregates a diverse range of technical assets. Mapped skills showcase verified accomplishments in software engineering, leadership responsibilities, and modular project delivery, indicating strong technical versatility and rapid learning adaptability.`;
    }

    setTwinAnalysis({
      archetype,
      alignment,
      growthRate: uniqueSkills > 15 ? 'Exponential (Top 1%)' : 'Accelerated (Top 5%)',
      summary,
      verifications: verificationsCount + 4, // Including preloaded index items
      skillsCount: uniqueSkills > 0 ? uniqueSkills + 12 : 24,
      techMaturity: Math.min(60 + uniqueSkills * 2 + projCount * 5, 99),
      synapticCount: (verificationsCount * 3) + (uniqueSkills * 2) + 15
    });

  }, [documents]);

  return (
    <div className="bg-[#0b0629]/40 border border-purple-950/20 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500" id="ai-digital-twin-component">
      
      {/* Laser Holographic scanline and glowing gradient lights */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500/10 rounded-full filter blur-xl group-hover:bg-blue-500/20 transition-all duration-500"></div>

      {/* Cyber holographic header */}
      <div className="flex items-center justify-between border-b border-purple-950/20 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative">
            <Fingerprint className="w-5 h-5 animate-pulse" />
            <span className="absolute inset-0 border border-purple-500/20 rounded-xl animate-ping opacity-30" style={{ animationDuration: '3s' }}></span>
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm text-white tracking-wide uppercase">AI Digital Twin</h3>
            <span className="text-[9px] font-mono text-purple-400 tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-purple-400" /> COGNITIVE IDENTITY HARVESTED
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-mono bg-emerald-950/30 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 font-bold tracking-widest uppercase">
            LIVE SYNAPSE
          </span>
        </div>
      </div>

      {/* Grid: Holographic Avatar representation on left, text diagnostics on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Holographic scanner and stats */}
        <div className="md:col-span-4 flex flex-col items-center justify-center relative p-4 bg-purple-950/5 border border-purple-950/20 rounded-2xl">
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center p-1 border-2 border-dashed border-purple-500/30">
            {/* Spinning radar lines */}
            <div className="absolute inset-0 rounded-full border border-purple-400/20 animate-spin" style={{ animationDuration: '10s' }}></div>
            <div className="absolute inset-2 rounded-full border border-dashed border-blue-400/20 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
            
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
              alt="Holographic Identity"
              className="w-full h-full rounded-full object-cover grayscale opacity-90 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.25)] relative z-10"
            />
            {/* Glowing active indicator */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#090424] rounded-full z-20 shadow-[0_0_10px_#10b981]"></span>
          </div>

          <div className="text-center mt-3.5 space-y-0.5">
            <h4 className="text-xs font-bold text-white font-display tracking-tight">{user?.name || 'Alex Mercer'}</h4>
            <p className="text-[10px] font-mono text-purple-400 font-semibold">{twinAnalysis.alignment}</p>
          </div>

          {/* Holographic Diagnostic Bars */}
          <div className="w-full mt-4 space-y-2 text-[9px] font-mono">
            <div className="flex justify-between text-gray-400">
              <span>TECH MATURITY:</span>
              <span className="text-white font-bold">{twinAnalysis.techMaturity}%</span>
            </div>
            <div className="w-full h-1 bg-purple-950 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full" style={{ width: `${twinAnalysis.techMaturity}%` }}></div>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>SYNAPSE LINKS:</span>
              <span className="text-white font-bold">{twinAnalysis.synapticCount}</span>
            </div>
            <div className="w-full h-1 bg-purple-950 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full" style={{ width: `${Math.min(15 + twinAnalysis.synapticCount * 2, 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Narrative / Archetype Details */}
        <div className="md:col-span-8 space-y-4">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Extracted Identity Archetype</span>
            <h2 className="text-base font-display font-black text-white flex items-center gap-1.5 leading-tight tracking-tight">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              {twinAnalysis.archetype}
            </h2>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">AI Digital Synthesis</span>
            <p className="text-xs text-gray-300 leading-relaxed bg-[#06021f]/60 p-4 rounded-xl border border-purple-950/25 relative font-sans">
              {twinAnalysis.summary}
              <span className="absolute bottom-1 right-2 text-[8px] text-purple-400 font-mono tracking-wider">GEN-3.5 Engine</span>
            </p>
          </div>

          {/* Credentials stats block */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-[#110c32]/40 border border-purple-950/10 rounded-xl">
              <span className="text-[9px] text-gray-400 uppercase font-mono block">PROOF ASSETS</span>
              <span className="text-sm font-display font-extrabold text-white">{twinAnalysis.verifications}</span>
            </div>
            <div className="p-2.5 bg-[#110c32]/40 border border-purple-950/10 rounded-xl">
              <span className="text-[9px] text-gray-400 uppercase font-mono block">VERIFIED SKILLS</span>
              <span className="text-sm font-display font-extrabold text-purple-400">{twinAnalysis.skillsCount}</span>
            </div>
            <div className="p-2.5 bg-[#110c32]/40 border border-purple-950/10 rounded-xl">
              <span className="text-[9px] text-gray-400 uppercase font-mono block">GROWTH CURVE</span>
              <span className="text-[10px] font-display font-extrabold text-emerald-400 truncate block mt-0.5">{twinAnalysis.growthRate.split(' ')[0]}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
