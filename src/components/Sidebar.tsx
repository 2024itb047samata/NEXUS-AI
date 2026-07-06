import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Network, 
  GitCommit, 
  MessageSquare, 
  Search, 
  FileText, 
  Briefcase, 
  Compass, 
  Settings,
  Brain,
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

export default function Sidebar({ currentTab, setCurrentTab, user, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'uploads', label: 'Upload Center', icon: UploadCloud },
    { id: 'graph', label: 'Knowledge Graph', icon: Network },
    { id: 'timeline', label: 'Timeline', icon: GitCommit },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'search', label: 'Smart Search', icon: Search },
    { id: 'resume', label: 'Resume Builder', icon: FileText },
    { id: 'portfolio', label: 'Portfolio Builder', icon: Briefcase },
    { id: 'insights', label: 'Career Insights', icon: Compass },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#06021f] border-b border-purple-900/40 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          <span className="font-display font-bold tracking-tight text-white">LifeGraph <span className="text-purple-400">AI</span></span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-300 hover:text-white"
          id="mobile-menu-toggle"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#050117] border-r border-purple-900/30 flex flex-col justify-between transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `} id="app-sidebar">
        {/* Upper Brand / Profile */}
        <div>
          {/* Brand header */}
          <div className="hidden md:flex items-center gap-2.5 px-6 py-6 border-b border-purple-900/20">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center glow-box">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-base tracking-tight text-white leading-none">LifeGraph AI</h1>
              <p className="text-[10px] text-purple-400 mt-1 font-mono tracking-widest uppercase">Digital Brain</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-tab-${item.id}`}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-950/40 to-blue-950/20 text-purple-300 border-l-2 border-purple-500 shadow-[inset_0_0_12px_rgba(168,85,247,0.06)]' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card footer */}
        {user && (
          <div className="p-4 border-t border-purple-900/20 bg-[#06021f]/50">
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                alt={user.name} 
                className="w-9 h-9 rounded-full border border-purple-500/30 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
              </div>
              <button 
                onClick={onLogout}
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors"
                title="Log Out"
                id="btn-logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        ></div>
      )}
    </>
  );
}
