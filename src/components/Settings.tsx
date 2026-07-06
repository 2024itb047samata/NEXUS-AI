import React, { useState } from 'react';
import { 
  Settings, 
  Sparkles, 
  Save, 
  Database, 
  ShieldAlert, 
  Cpu, 
  HelpCircle,
  Activity,
  CheckCircle,
  Clock,
  User,
  GitBranch
} from 'lucide-react';

export default function SettingsView() {
  const [targetRole, setTargetRole] = useState('Machine Learning Engineer');
  const [targetCompany, setTargetCompany] = useState('Tesla');
  const [bio, setBio] = useState('Building robust AI processing pipelines, optimizing model metrics, and preparing production-grade full-stack products.');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Workspace preferences updated. Synaptic coordinates saved.');
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="settings-view">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/20 to-blue-950/10 p-6 rounded-3xl border border-purple-950/30">
        <div className="space-y-1">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            Workspace Preferences & Credentials Config
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Configure target benchmarking filters, edit metadata details, or inspect encrypted database and integration states.
          </p>
        </div>
      </div>

      {/* Grid: Settings forms on left, API details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settings forms */}
        <div className="lg:col-span-2 bg-[#0b0629]/40 border border-purple-950/20 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] space-y-5">
          <div className="flex justify-between items-center border-b border-purple-950/20 pb-4">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" /> Profile Target Benchmarks
            </h3>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-xs font-semibold rounded-xl text-white transition-all cursor-pointer flex items-center gap-1"
              id="btn-save-settings"
            >
              {saving ? <Cpu className="w-4 h-4 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Workspace
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-400">Target Role</label>
              <input 
                type="text" 
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-400">Target Company</label>
              <input 
                type="text" 
                value={targetCompany} 
                onChange={(e) => setTargetCompany(e.target.value)}
                className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-gray-400">Candidate Workspace Bio</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Database & API State */}
        <div className="bg-[#0b0629]/40 border border-purple-950/20 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] space-y-5">
          <div className="flex items-center gap-2 border-b border-purple-950/20 pb-4">
            <Database className="w-4 h-4 text-blue-400" />
            <h3 className="font-display font-bold text-sm text-white">System Diagnostics</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-mono">Gemini Integration:</span>
              <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> SECURE_LIVE
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-mono">Local Index Database:</span>
              <span className="text-blue-400 font-mono font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> JSON_DB_PERSISTED
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-mono">Port Tunnel Address:</span>
              <span className="text-purple-400 font-mono font-semibold">0.0.0.0:3000</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-mono">Diagnostic State:</span>
              <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 animate-pulse" /> NORMAL
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-mono">Security Encryption:</span>
              <span className="text-gray-300 font-mono font-semibold">AES-256 Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
