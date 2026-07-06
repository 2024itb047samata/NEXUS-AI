import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadCenter from './components/UploadCenter';
import KnowledgeGraph from './components/KnowledgeGraph';
import TimelineView from './components/TimelineView';
import AIChat from './components/AIChat';
import SmartSearch from './components/SmartSearch';
import ResumeBuilder from './components/ResumeBuilder';
import PortfolioBuilder from './components/PortfolioBuilder';
import CareerInsights from './components/CareerInsights';
import SettingsView from './components/Settings';
import CommandPalette from './components/CommandPalette';
import PresentationMode from './components/PresentationMode';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isPresentationModeActive, setIsPresentationModeActive] = useState(false);

  // Authentication flows
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('john.doe@iitb.ac.in');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('John Doe');
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  // Check if session exists in localStorage
  useEffect(() => {
    const cached = localStorage.getItem('lifegraph_session_user');
    if (cached) {
      const parsed = JSON.parse(cached);
      setUser(parsed);
    }
  }, []);

  // Fetch indexed documents whenever user is active
  const fetchDocuments = async () => {
    if (!user) return;
    setLoadingDocs(true);
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  // Keyboard shortcut listener for Command Palette (Ctrl+K or Meta+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');

    if (authMode === 'login') {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
          setUser(data.user);
          localStorage.setItem('lifegraph_session_user', JSON.stringify(data.user));
        } else {
          setAuthError(data.message || 'Invalid credentials');
        }
      } catch (err) {
        setAuthError('Connection failed. Server not responding.');
      }
    } else if (authMode === 'register') {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
          setUser(data.user);
          localStorage.setItem('lifegraph_session_user', JSON.stringify(data.user));
        } else {
          setAuthError(data.message || 'Registration failed');
        }
      } catch (err) {
        setAuthError('Registration failed. Check network link.');
      }
    } else {
      // Forgot password
      try {
        const res = await fetch('/api/auth/forgot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        setAuthSuccessMsg(data.message || 'Reset guidelines dispatched.');
      } catch (err) {
        setAuthError('Reset trigger error.');
      }
    }
  };

  // Immediate Quick Access Bypass
  const handleQuickDemoAccess = () => {
    const demoUser = {
      id: 'demo_user_01',
      name: 'John Doe',
      email: 'john.doe@iitb.ac.in',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
    };
    setUser(demoUser);
    localStorage.setItem('lifegraph_session_user', JSON.stringify(demoUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lifegraph_session_user');
    setCurrentTab('dashboard');
  };

  // Main UI router
  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard documents={documents} onNavigateTab={setCurrentTab} user={user} />;
      case 'uploads':
        return <UploadCenter documents={documents} onUploadSuccess={fetchDocuments} />;
      case 'graph':
        return <KnowledgeGraph documents={documents} />;
      case 'timeline':
        return <TimelineView documents={documents} />;
      case 'chat':
        return <AIChat documents={documents} />;
      case 'search':
        return <SmartSearch documents={documents} />;
      case 'resume':
        return <ResumeBuilder documents={documents} />;
      case 'portfolio':
        return <PortfolioBuilder documents={documents} />;
      case 'insights':
        return <CareerInsights documents={documents} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard documents={documents} onNavigateTab={setCurrentTab} />;
    }
  };

  // 1. Unauthenticated Gateway
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050117] flex items-center justify-center p-6 relative overflow-hidden" id="login-container">
        
        {/* Dynamic Glowing Accent Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-900/10 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Auth Box Card */}
        <div className="w-full max-w-md bg-[#090424]/60 border border-purple-950/40 p-8 rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl relative z-10 space-y-6 glow-box">
          
          {/* Logo Brand Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 mx-auto flex items-center justify-center glow-box shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-display font-extrabold text-white tracking-tight">LifeGraph <span className="text-purple-400">AI</span></h1>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">Your Verifiable Digital Memory Synaptic System</p>
          </div>

          {/* Error and Success notifications */}
          {authError && (
            <div className="p-3.5 bg-red-950/20 border border-red-900/30 rounded-xl text-xs text-red-400 flex items-start gap-2 animate-pulse">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccessMsg && (
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-xs text-emerald-400 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-purple-400" /> Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  required
                  id="reg-name-input"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-purple-400" /> Email Address
              </label>
              <input 
                type="email" 
                placeholder="e.g. john.doe@iitb.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                required
                id="auth-email-input"
              />
            </div>

            {authMode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-purple-400" /> Password
                  </label>
                  {authMode === 'login' && (
                    <button 
                      type="button" 
                      onClick={() => setAuthMode('forgot')}
                      className="text-[10px] text-purple-400 hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input 
                  type="password" 
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  required
                  id="auth-password-input"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs font-bold rounded-2xl text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
              id="btn-auth-submit"
            >
              {authMode === 'login' ? 'Access Digital Brain' : authMode === 'register' ? 'Provision Synaptic Account' : 'Request Password Reset Link'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Access bypass */}
          <div className="space-y-3">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-purple-950/20"></div>
              <span className="flex-shrink mx-4 text-[9px] font-mono text-gray-500 uppercase tracking-wider">Fast-track Demo</span>
              <div className="flex-grow border-t border-purple-950/20"></div>
            </div>

            <button
              onClick={handleQuickDemoAccess}
              className="w-full py-2.5 bg-purple-950/15 hover:bg-purple-950/25 border border-purple-900/30 hover:border-purple-500 rounded-2xl text-xs font-semibold text-purple-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[inset_0_0_10px_rgba(168,85,247,0.05)]"
              id="btn-demo-quick-bypass"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" /> Click for Instant Reviewer Access &rarr;
            </button>
          </div>

          {/* Footer selectors toggle */}
          <div className="text-center">
            {authMode === 'login' ? (
              <p className="text-xs text-gray-400">
                Don&apos;t have an account?{' '}
                <button onClick={() => setAuthMode('register')} className="text-purple-400 font-semibold hover:underline cursor-pointer">
                  Register
                </button>
              </p>
            ) : (
              <p className="text-xs text-gray-400">
                Already have an account?{' '}
                <button onClick={() => setAuthMode('login')} className="text-purple-400 font-semibold hover:underline cursor-pointer">
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Main Authenticated workspace shell
  return (
    <div className="min-h-screen bg-[#040114] text-white flex flex-col md:flex-row overflow-hidden relative font-sans" id="app-workspace">
      
      {/* Sidebar navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        user={user} 
        onLogout={handleLogout} 
      />

      {/* Main interactive tabs viewport */}
      <main className="flex-1 overflow-y-auto h-screen px-4 py-6 md:p-8" id="tab-content-viewport">
        {renderTabContent()}
      </main>

      {/* Floating Global Utility Triggers for presentation and search */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2.5 z-40">
        <button
          onClick={() => setIsPresentationModeActive(true)}
          className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] cursor-pointer flex items-center justify-center transition-all hover:scale-105 group"
          title="Launch Live Presentation Sequence"
          id="btn-trigger-presentation-float"
        >
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out text-[10px] font-mono font-bold uppercase ml-0 group-hover:ml-1.5 whitespace-nowrap">LAUNCH DEMO</span>
        </button>

        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-3 bg-purple-950/80 hover:bg-purple-950 border border-purple-500/30 hover:border-purple-500 text-purple-300 rounded-full shadow-lg cursor-pointer flex items-center justify-center transition-all hover:scale-105 group"
          title="Open Cognitive Command Palette (Ctrl+K)"
          id="btn-trigger-cmd-float"
        >
          <Brain className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out text-[10px] font-mono font-bold uppercase ml-0 group-hover:ml-1.5 whitespace-nowrap">COMMANDS (Ctrl+K)</span>
        </button>
      </div>

      {/* Overlays */}
      {isCommandPaletteOpen && (
        <CommandPalette 
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)} 
          setCurrentTab={setCurrentTab}
          documents={documents}
          onLaunchPresentation={() => {
            setIsCommandPaletteOpen(false);
            setIsPresentationModeActive(true);
          }}
        />
      )}

      {isPresentationModeActive && (
        <PresentationMode 
          onClose={() => setIsPresentationModeActive(false)} 
          setCurrentTab={setCurrentTab}
          documents={documents}
        />
      )}
    </div>
  );
}
