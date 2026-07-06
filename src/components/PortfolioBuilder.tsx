import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  Eye, 
  Settings2, 
  Download, 
  Check, 
  ExternalLink,
  Laptop,
  Smartphone,
  Cpu,
  Save,
  Globe,
  Monitor
} from 'lucide-react';

interface PortfolioBuilderProps {
  documents: any[];
}

export default function PortfolioBuilder({ documents }: PortfolioBuilderProps) {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Customization Accent
  const [accent, setAccent] = useState('purple'); // 'purple' | 'emerald' | 'blue'
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'projects' | 'contact'

  // Form edit states
  const [bioTitle, setBioTitle] = useState('Machine Learning Engineer');
  const [bioIntro, setBioIntro] = useState('Building next-generation computer vision algorithms and optimizing deep learning models for latency on distributed hardware systems.');

  const fetchPortfolioConfig = async () => {
    try {
      const res = await fetch('/api/portfolio/config');
      const data = await res.json();
      setConfig(data);
      setBioTitle(data.bio?.title || 'Machine Learning Engineer');
      setBioIntro(data.bio?.intro || 'Building next-generation computer vision algorithms and optimizing deep learning models for latency on distributed hardware systems.');
    } catch (err) {
      console.error('Error fetching portfolio config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioConfig();
  }, [documents]);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const updated = {
        ...config,
        bio: {
          title: bioTitle,
          intro: bioIntro
        }
      };
      const res = await fetch('/api/portfolio/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      setConfig(data);
      alert('Portfolio deployment config saved. Digital Synapse compiled.');
    } catch (err) {
      console.error('Error saving portfolio config:', err);
    } finally {
      setSaving(false);
    }
  };

  // Compile full functional HTML landing page for export
  const handleExportHTML = () => {
    const accentHex = accent === 'purple' ? '#a855f7' : accent === 'emerald' ? '#10b981' : '#3b82f6';
    const htmlString = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alex Mercer - Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #06021f; color: #fff; }
    .glow { box-shadow: 0 0 40px rgba(168, 85, 247, 0.15); }
  </style>
</head>
<body class="selection:bg-purple-500 selection:text-white">

  <!-- Header -->
  <header class="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center border-b border-white/5">
    <div class="text-lg font-bold tracking-tight text-white">Alex <span style="color: ${accentHex}">Mercer</span></div>
    <nav class="hidden md:flex gap-6 text-sm text-gray-400">
      <a href="#about" class="hover:text-white transition">About</a>
      <a href="#projects" class="hover:text-white transition">Projects</a>
      <a href="#contact" class="hover:text-white transition">Contact</a>
    </nav>
    <a href="#contact" class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition">Get In Touch</a>
  </header>

  <!-- Hero -->
  <section class="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
    <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
      <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${accentHex}"></span> AI Verified Portfolio
    </div>
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">${bioTitle}</h1>
    <p class="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">${bioIntro}</p>
    <div class="flex justify-center gap-4 pt-4">
      <a href="#projects" class="px-6 py-3 rounded-xl text-xs font-bold text-white transition hover:brightness-110" style="background-color: ${accentHex}">View Selected Projects</a>
      <a href="#contact" class="px-6 py-3 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white transition hover:bg-white/10">Contact</a>
    </div>
  </section>

  <!-- Projects -->
  <section id="projects" class="max-w-6xl mx-auto px-6 py-20 border-t border-white/5 space-y-12">
    <div class="text-center">
      <h2 class="text-2xl font-bold">Selected Accomplishments</h2>
      <p class="text-xs text-gray-400 mt-2">Parsed, mapped and verified directly via LifeGraph synapses.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${config.projects?.map((proj: any) => `
        <div class="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-purple-500/40 transition">
          <h3 class="font-bold text-lg">${proj.title}</h3>
          <p class="text-xs text-gray-400 mt-2 leading-relaxed">${proj.details}</p>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Footer -->
  <footer class="max-w-6xl mx-auto px-6 py-12 border-t border-white/5 text-center text-xs text-gray-500 font-mono">
    &copy; ${new Date().getFullYear()} Alex Mercer. Generated using LifeGraph AI.
  </footer>

</body>
</html>
    `;

    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alex-mercer-portfolio.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !config) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
        <p className="text-xs font-mono text-gray-400">Compiling AI Portfolio previews...</p>
      </div>
    );
  }

  // Set colors dynamically based on selected accent
  const getAccentColors = () => {
    if (accent === 'purple') return { text: 'text-purple-400', bg: 'bg-purple-600', border: 'border-purple-500', hoverBg: 'hover:bg-purple-700', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]' };
    if (accent === 'emerald') return { text: 'text-emerald-400', bg: 'bg-emerald-600', border: 'border-emerald-500', hoverBg: 'hover:bg-emerald-700', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' };
    return { text: 'text-blue-400', bg: 'bg-blue-600', border: 'border-blue-500', hoverBg: 'hover:bg-blue-700', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]' };
  };

  const styleColors = getAccentColors();

  return (
    <div className="space-y-8 animate-fade-in" id="portfolio-builder-view">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/20 to-blue-950/10 p-6 rounded-3xl border border-purple-950/30">
        <div className="space-y-1">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            AI Portfolio Designer
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Customize and launch a live digital portfolio web page that displays your credentials, certifications, and project links cleanly.
          </p>
        </div>
        <button
          onClick={handleExportHTML}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs font-semibold rounded-xl text-white transition-all cursor-pointer flex items-center gap-1.5"
          id="btn-export-html"
        >
          <Download className="w-4 h-4" /> Download index.html
        </button>
      </div>

      {/* Grid: Editor panel on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Settings / Editor Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Custom Accents block */}
          <div className="bg-[#0b0629]/40 border border-purple-950/20 p-5 rounded-3xl space-y-4">
            <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider block">Visual Accent Glow</span>
            <div className="flex gap-2">
              {[
                { id: 'purple', label: 'Neon Purple', color: 'bg-purple-500' },
                { id: 'emerald', label: 'Emerald Green', color: 'bg-emerald-500' },
                { id: 'blue', label: 'Sapphire Blue', color: 'bg-blue-500' }
              ].map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setAccent(acc.id)}
                  className={`
                    flex-1 py-2 px-3 rounded-xl text-[10px] font-semibold transition-all border cursor-pointer flex items-center justify-center gap-1.5
                    ${accent === acc.id 
                      ? 'border-purple-500 bg-purple-950/20 text-white' 
                      : 'border-purple-950/20 bg-black/20 text-gray-400 hover:text-white'
                    }
                  `}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${acc.color}`}></span>
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section Editors Form */}
          <div className="bg-[#0b0629]/40 border border-purple-950/20 p-5 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Hero Section Content</span>
              <button 
                onClick={handleSaveConfig}
                className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono cursor-pointer"
                id="btn-save-portfolio-details"
              >
                <Save className="w-3.5 h-3.5" /> Save Synapse
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-gray-500">Bio Title / Headline</label>
                <input 
                  type="text" 
                  value={bioTitle} 
                  onChange={(e) => setBioTitle(e.target.value)}
                  className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-gray-500">Intro Description</label>
                <textarea 
                  value={bioIntro} 
                  onChange={(e) => setBioIntro(e.target.value)}
                  rows={4}
                  className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Iframe/Device Previewer */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center px-4">
            <span className="text-[10px] font-mono uppercase text-gray-400">Deployment Live Sandbox</span>
            <div className="flex items-center gap-1.5 bg-[#110c32]/40 p-1 border border-purple-950/30 rounded-xl">
              <button 
                onClick={() => setPreviewMode('desktop')} 
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${previewMode === 'desktop' ? 'bg-purple-950/50 text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPreviewMode('mobile')} 
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${previewMode === 'mobile' ? 'bg-purple-950/50 text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Iframe mockup sheet */}
          <div className="flex justify-center transition-all duration-300">
            <div className={`
              bg-[#050117] border border-purple-900/20 rounded-3xl overflow-hidden p-6 text-white shadow-[0_4px_40px_rgba(0,0,0,0.6)] relative
              ${previewMode === 'desktop' ? 'w-full' : 'w-[360px] h-[550px] overflow-y-auto'}
            `} id="portfolio-live-container">
              
              {/* Header inside mock */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="text-sm font-bold tracking-tight text-white">Alex <span className={styleColors.text}>Mercer</span></div>
                <div className="hidden md:flex gap-4 text-[10px] text-gray-400">
                  <span>About</span>
                  <span>Projects</span>
                  <span>Contact</span>
                </div>
              </div>

              {/* Inner content mock */}
              <div className="py-12 text-center space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[9px] text-gray-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${accent === 'purple' ? 'bg-purple-500' : accent === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                  AI Verified Portfolio
                </div>
                <h2 className="text-xl md:text-3xl font-extrabold tracking-tight leading-tight max-w-lg mx-auto">{bioTitle}</h2>
                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">{bioIntro}</p>
                <div className="flex justify-center gap-3 pt-3">
                  <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold text-white cursor-pointer ${styleColors.bg} ${styleColors.glow}`}>Explore Projects</span>
                  <span className="px-4 py-1.5 rounded-lg text-[10px] font-bold bg-white/5 border border-white/10 text-white">Contact</span>
                </div>
              </div>

              {/* Selected Projects block in mock */}
              <div className="space-y-4 border-t border-white/5 pt-6">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider text-center">Selected Accomplishments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {config.projects?.map((p: any, i: number) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
                      <h4 className="text-xs font-bold text-white">{p.title}</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed truncate">{p.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer verifier block */}
              <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-gray-500">
                <span>&copy; {new Date().getFullYear()} Alex Mercer</span>
                <span>lg_verifiable_id_7a2b9f3e</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
