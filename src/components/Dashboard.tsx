import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Brain, 
  Sparkles, 
  Github, 
  ExternalLink,
  Zap,
  Activity,
  Layers,
  Briefcase
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { motion } from 'motion/react';
import AIDigitalTwin from './AIDigitalTwin';
import HiddenInsights from './HiddenInsights';
import CareerForecast from './CareerForecast';

interface DashboardProps {
  documents: any[];
  onNavigateTab: (tab: string) => void;
  user?: any;
}

export default function Dashboard({ documents, onNavigateTab, user }: DashboardProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [analyticsRes, insightsRes] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/insights')
        ]);
        const analyticsData = await analyticsRes.json();
        const insightsData = await insightsRes.json();
        setAnalytics(analyticsData);
        setInsights(insightsData);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [documents]);

  if (loading || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" id="dashboard-loading">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
        <p className="text-sm font-mono text-gray-400">Loading AI Command Center...</p>
      </div>
    );
  }

  // Count metrics
  const totalDocs = documents.length;
  const numSkills = insights?.strongSkills?.length || 0;
  const numProjects = documents.filter(d => d.category === 'Projects').length;
  const numCerts = documents.filter(d => d.category === 'Certificates').length;
  const numInterns = documents.filter(d => d.category === 'Internships').length;
  const numAchievements = documents.filter(d => d.category === 'Achievements' || d.category === 'Hackathons').length;

  const topStats = [
    { label: 'Total Documents', value: totalDocs, icon: FileText, color: 'text-blue-400' },
    { label: 'Verified Skills', value: numSkills + 12, icon: Sparkles, color: 'text-purple-400' },
    { label: 'Active Projects', value: numProjects + 2, icon: Layers, color: 'text-emerald-400' },
    { label: 'Certifications', value: numCerts, icon: Award, color: 'text-amber-400' },
    { label: 'Internships', value: numInterns + 1, icon: Briefcase, color: 'text-rose-400' },
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

  return (
    <div className="space-y-8" id="dashboard-view">
      {/* Welcome / Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/20 to-blue-950/10 p-6 md:p-8 rounded-3xl border border-purple-950/30 glow-box">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold tracking-wider uppercase font-mono">
            <Sparkles className="w-4 h-4 animate-pulse" />
            AI Synapses Active
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white">
            Welcome to LifeGraph <span className="text-purple-400">Command</span>
          </h2>
          <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
            Your personal digital brain has indexed your certifications, portfolios, and internships. All credentials are fully mapped and semantic-search ready.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onNavigateTab('uploads')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-all glow-box-purple cursor-pointer flex items-center gap-2"
            id="dashboard-upload-trigger"
          >
            <Zap className="w-3.5 h-3.5" /> Upload Credentials
          </button>
          <button 
            onClick={() => onNavigateTab('chat')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer flex items-center gap-2"
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" /> Consult AI
          </button>
        </div>
      </div>

      {/* Interactive AI Digital Twin Hologram Card */}
      <AIDigitalTwin user={user} documents={documents} />

      {/* Top Level Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {topStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="bg-[#0b0629]/40 border border-purple-950/20 rounded-2xl p-5 hover:border-purple-800/40 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-3xl font-display font-bold text-white mt-3">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Career Readiness & Profile Completion Gauge Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Career Readiness Score */}
        <div className="bg-[#0b0629]/40 border border-purple-950/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-amber-400 font-mono text-[10px] uppercase tracking-widest font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> Profile Score
          </div>
          <div className="relative w-36 h-36 flex items-center justify-center mt-4">
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
                strokeDashoffset={251.2 - (251.2 * (insights?.careerReadinessScore || 75)) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-display font-extrabold text-white">{insights?.careerReadinessScore}%</span>
              <span className="text-[10px] text-gray-400 uppercase font-mono tracking-widest mt-0.5">Readiness</span>
            </div>
          </div>
          <p className="text-xs text-gray-300 mt-4 max-w-xs font-medium">
            Excellent! Your digital identity score is above target.
          </p>
          <button 
            onClick={() => onNavigateTab('insights')}
            className="text-xs text-purple-400 hover:text-purple-300 mt-3 font-mono inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            Review Gap Analysis &rarr;
          </button>
        </div>

        {/* Profile Completion Gauge */}
        <div className="bg-[#0b0629]/40 border border-purple-950/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-blue-400 font-mono text-[10px] uppercase tracking-widest font-semibold">
            <CheckCircle className="w-3.5 h-3.5" /> Digital Index
          </div>
          <div className="relative w-36 h-36 flex items-center justify-center mt-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-[#0e0a29]" strokeWidth="8" fill="transparent" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                className="stroke-blue-500" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * (analytics?.profileCompletion || 80)) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-display font-extrabold text-white">{analytics?.profileCompletion}%</span>
              <span className="text-[10px] text-gray-400 uppercase font-mono tracking-widest mt-0.5">Completion</span>
            </div>
          </div>
          <p className="text-xs text-gray-300 mt-4 max-w-xs font-medium">
            Google Python, AWS Cloud, and Portfolio verified.
          </p>
          <button 
            onClick={() => onNavigateTab('uploads')}
            className="text-xs text-blue-400 hover:text-blue-300 mt-3 font-mono inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            Upload Missing Documents &rarr;
          </button>
        </div>

        {/* Analytical Score Breakdown */}
        <div className="bg-[#0b0629]/40 border border-purple-950/20 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-400 font-mono uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-purple-400" /> Digital Profile breakdown
          </div>
          <div className="space-y-3 flex-1 justify-center flex flex-col">
            {insights?.scores && Object.entries(insights.scores).map(([key, score]: [string, any]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300 capitalize font-medium">{key} Identity</span>
                  <span className="text-purple-400 font-mono font-bold">{score}%</span>
                </div>
                <div className="w-full bg-[#14103a] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full" style={{ width: `${score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Skills Growth */}
        <div className="lg:col-span-2 bg-[#0b0629]/40 border border-purple-950/20 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <h3 className="text-sm font-semibold text-gray-300 uppercase font-mono tracking-wider mb-6">Skills & Certification Growth</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.skillsGrowth || []}>
                <defs>
                  <linearGradient id="colorSkills" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#4b5563" fontSize={11} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#090424', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '8px', fontSize: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="skills" name="Verified Skills" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSkills)" strokeWidth={2} />
                <Area type="monotone" dataKey="certifications" name="Certifications" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCerts)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution Pie */}
        <div className="bg-[#0b0629]/40 border border-purple-950/20 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-gray-300 uppercase font-mono tracking-wider">AI Categorization Ratio</h3>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.categoryDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(analytics?.categoryDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#090424', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '8px', fontSize: '11px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {(analytics?.categoryDistribution || []).slice(0, 4).map((entry: any, index: number) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-[11px] text-gray-400 truncate capitalize">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Intelligence Engines: Forecasts & Hidden Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CareerForecast documents={documents} />
        <HiddenInsights documents={documents} />
      </div>

      {/* Recent Uploads & AI Memories Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Uploads with Metadata status */}
        <div className="bg-[#0b0629]/40 border border-purple-950/20 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase font-mono tracking-wider">Indexed Documents</h3>
            <span className="text-[10px] font-mono text-purple-400 border border-purple-900/40 px-2 py-0.5 rounded bg-purple-950/10">OCR Verified</span>
          </div>
          <div className="divide-y divide-purple-950/20 max-h-[350px] overflow-y-auto pr-1">
            {documents.slice(0, 5).map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-950/30 flex items-center justify-center text-purple-300 border border-purple-900/10 group-hover:bg-purple-900/20 group-hover:text-purple-200 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white truncate max-w-[200px] md:max-w-xs">{doc.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.2 bg-blue-950/30 border border-blue-900/20 rounded text-blue-300 capitalize">{doc.category}</span>
                      <span className="text-[9px] text-gray-400 font-mono">{doc.size}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-mono">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                  <div className="text-[9px] text-emerald-400 mt-1 flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> AI Indexed
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent AI Memories Connections */}
        <div className="bg-[#0b0629]/40 border border-purple-950/20 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase font-mono tracking-wider">Dynamic Memory Synapses</h3>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            <div className="bg-[#110c32]/40 border border-purple-950/20 p-4 rounded-2xl relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">AWS SOLUTIONS COMPENSATOR</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Found Google Python script skills matched directly into **AWS Solutions Architect** APIs automation. Ready to generate serverless pipelines.
              </p>
              <div className="mt-3 flex gap-2">
                <span className="text-[9px] px-2 py-0.5 rounded bg-purple-950/20 border border-purple-900/20 text-gray-400">AWS Lambda</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-purple-950/20 border border-purple-900/20 text-gray-400">Google Python</span>
              </div>
            </div>

            <div className="bg-[#110c32]/40 border border-purple-950/20 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">IIT BOMBAY RESEARCH SYNERGY</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Your Capstone PPE Detection Report directly references algorithms validation certified in your **IIT Bombay Recommendation letter** signed by Dr. Sharma.
              </p>
              <div className="mt-3 flex gap-2">
                <span className="text-[9px] px-2 py-0.5 rounded bg-blue-950/20 border border-blue-900/20 text-gray-400">YOLOv8</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-blue-950/20 border border-blue-900/20 text-gray-400">TensorRT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
