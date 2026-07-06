import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Printer, 
  Copy, 
  Check, 
  Cpu, 
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Save
} from 'lucide-react';

interface ResumeBuilderProps {
  documents: any[];
}

export default function ResumeBuilder({ documents }: ResumeBuilderProps) {
  const [config, setConfig] = useState<any>(null);
  const [template, setTemplate] = useState('ml'); // 'ml' | 'swe' | 'backend' | 'research'
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form edit states
  const [personal, setPersonal] = useState({ name: '', email: '', phone: '', location: '', github: '' });

  const fetchResumeConfig = async () => {
    try {
      const res = await fetch('/api/resume/config');
      const data = await res.json();
      setConfig(data);
      setPersonal({
        name: data.personalInfo?.name || 'Alex Mercer',
        email: data.personalInfo?.email || 'alex.mercer@gmail.com',
        phone: data.personalInfo?.phone || '+1 (555) 019-2834',
        location: data.personalInfo?.location || 'San Francisco, CA',
        github: data.personalInfo?.github || 'github.com/alexmercer',
      });
    } catch (err) {
      console.error('Error fetching resume config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeConfig();
  }, [documents]);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const updated = {
        ...config,
        personalInfo: personal,
      };
      const res = await fetch('/api/resume/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      setConfig(data);
      alert('Resume configuration saved successfully. Mapped into LifeGraph indexes.');
    } catch (err) {
      console.error('Error saving resume config:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    // Stringify resume elegantly
    const text = `
${personal.name}
${personal.email} | ${personal.phone} | ${personal.location} | ${personal.github}

SUMMARY:
${config?.summary || ''}

EDUCATION:
${config?.education?.map((e: any) => `${e.degree} - ${e.institution} (${e.years})\nGPA: ${e.gpa}`).join('\n\n')}

EXPERIENCE:
${config?.experience?.map((e: any) => `${e.role} at ${e.company} (${e.years})\n- ${e.details}`).join('\n\n')}

PROJECTS:
${config?.projects?.map((p: any) => `${p.title}\n- ${p.details}`).join('\n\n')}

SKILLS:
${config?.skills?.join(', ')}
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !config) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
        <p className="text-xs font-mono text-gray-400">Loading AI Resume configurations...</p>
      </div>
    );
  }

  // Adjust content details slightly based on active template category
  const getSelectedSummary = () => {
    if (template === 'ml') {
      return "Innovative Machine Learning Engineer specializing in deep learning architectures, computer vision pipelines, and scalable tensor deployments. Experienced optimizing YOLO models on edge devices.";
    } else if (template === 'swe') {
      return "Full Stack Software Engineer focusing on high-performance distributed systems, state synchronization protocols, and custom Web UI architectures. Highly skilled in React, TypeScript, Node, and Rust.";
    } else if (template === 'backend') {
      return "Dedicated Backend Engineer expert at building robust APIs, optimizing database schemas, handling message broker synchronization, and provisioning scalable Docker/K8s microservices.";
    } else {
      return "Research Scholar focusing on algorithmic optimizations, real-time computer vision networks, and sensor-fusion. Published researcher in hardware-accelerated deep learning architectures.";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="resume-builder-view">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/20 to-blue-950/10 p-6 rounded-3xl border border-purple-950/30">
        <div className="space-y-1">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            AI Resume Customizer
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Generate customized, verifiable resumes tailored to ML, Full-Stack, or Research jobs. Edits sync directly into your digital identity parameters.
          </p>
        </div>
        <div className="flex gap-2.5 shrink-0">
          <button 
            onClick={handleCopyText}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-medium border border-white/10 rounded-xl text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
            Copy Raw Text
          </button>
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-xs font-medium rounded-xl text-white transition-all glow-box-purple cursor-pointer flex items-center gap-1.5"
            id="btn-print-resume"
          >
            <Printer className="w-4 h-4" /> Export Print View
          </button>
        </div>
      </div>

      {/* Grid: Edit panel on Left, Live PDF View on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        
        {/* Left: Configuration Forms (hide in print) */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          {/* Template Selectors */}
          <div className="bg-[#0b0629]/40 border border-purple-950/20 p-5 rounded-3xl space-y-4">
            <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider block">Job Profile Template</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'ml', label: 'Machine Learning' },
                { id: 'swe', label: 'Full Stack SWE' },
                { id: 'backend', label: 'Backend Dev' },
                { id: 'research', label: 'Research Scholar' }
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setTemplate(tpl.id)}
                  className={`
                    py-2.5 px-3 rounded-xl text-left text-[11px] font-semibold transition-all cursor-pointer
                    ${template === tpl.id 
                      ? 'bg-purple-950/30 border border-purple-500 text-purple-300' 
                      : 'bg-black/20 border border-purple-950/10 text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                  id={`btn-template-select-${tpl.id}`}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details editing form */}
          <div className="bg-[#0b0629]/40 border border-purple-950/20 p-5 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Contact Details</span>
              <button 
                onClick={handleSaveConfig}
                className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono cursor-pointer"
                id="btn-save-contact-details"
              >
                <Save className="w-3.5 h-3.5" /> Save Synapse
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-gray-500">Full Name</label>
                <input 
                  type="text" 
                  value={personal.name} 
                  onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                  className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-gray-500">Email Address</label>
                <input 
                  type="email" 
                  value={personal.email} 
                  onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                  className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-gray-500">Phone</label>
                <input 
                  type="text" 
                  value={personal.phone} 
                  onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                  className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-gray-500">Location</label>
                <input 
                  type="text" 
                  value={personal.location} 
                  onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
                  className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-gray-500">GitHub URL</label>
                <input 
                  type="text" 
                  value={personal.github} 
                  onChange={(e) => setPersonal({ ...personal, github: e.target.value })}
                  className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Resume Paper sheet styling */}
        <div className="lg:col-span-8 bg-white text-[#111111] p-8 md:p-12 rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.6)] min-h-[840px] font-serif print:rounded-none print:shadow-none print:p-0" id="resume-sheet-preview">
          
          {/* Header block */}
          <div className="text-center border-b-2 border-gray-900 pb-5 space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-black">{personal.name}</h1>
            <div className="text-[11px] text-gray-600 font-sans flex flex-wrap justify-center gap-x-4 gap-y-1 font-medium">
              <span>{personal.location}</span>
              <span>&bull;</span>
              <span>{personal.email}</span>
              <span>&bull;</span>
              <span>{personal.phone}</span>
              <span>&bull;</span>
              <span>{personal.github}</span>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mt-6 space-y-1.5">
            <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-black border-b border-gray-300 pb-0.5">Professional Summary</h2>
            <p className="text-xs leading-relaxed font-sans text-gray-800">{getSelectedSummary()}</p>
          </div>

          {/* Education Block */}
          <div className="mt-6 space-y-3">
            <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-black border-b border-gray-300 pb-0.5">Education</h2>
            {config.education?.map((edu: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start text-xs font-sans">
                <div>
                  <h3 className="font-bold text-black">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.institution}</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-black">{edu.years}</span>
                  <p className="text-gray-600 font-medium">GPA: {edu.gpa}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Work Experience */}
          <div className="mt-6 space-y-4">
            <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-black border-b border-gray-300 pb-0.5">Work Experience</h2>
            {config.experience?.map((exp: any, idx: number) => (
              <div key={idx} className="space-y-1.5 font-sans">
                <div className="flex justify-between text-xs font-semibold">
                  <h3 className="font-bold text-black">{exp.role} <span className="text-gray-600 font-normal">at {exp.company}</span></h3>
                  <span className="text-gray-600">{exp.years}</span>
                </div>
                <p className="text-xs leading-relaxed text-gray-800 pl-4 list-item list-disc">{exp.details}</p>
              </div>
            ))}
          </div>

          {/* Key Projects */}
          <div className="mt-6 space-y-4">
            <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-black border-b border-gray-300 pb-0.5">Key Projects</h2>
            {config.projects?.map((proj: any, idx: number) => (
              <div key={idx} className="space-y-1.5 font-sans">
                <h3 className="text-xs font-bold text-black">{proj.title}</h3>
                <p className="text-xs leading-relaxed text-gray-800 pl-4 list-item list-disc">{proj.details}</p>
              </div>
            ))}
          </div>

          {/* Mapped Skills */}
          <div className="mt-6 space-y-2">
            <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-black border-b border-gray-300 pb-0.5">Technical Competencies</h2>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs font-sans text-gray-800">
              {config.skills?.map((sk: string, idx: number) => (
                <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-gray-800 text-[10px] font-semibold border border-gray-200">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Footer verifier block (does not print) */}
          <div className="mt-8 pt-4 border-t border-dashed border-gray-300 flex justify-between items-center text-[10px] font-sans text-gray-400 print:hidden">
            <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-purple-600 animate-pulse" /> AI Verifiable Synapses Mapped</span>
            <span>Hash Identifier: lg_id_7a2b9f3e</span>
          </div>
        </div>
      </div>
    </div>
  );
}
