import React from 'react';
import {
  Shield,
  TrendingUp,
  Target,
  Activity,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Bell
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'risk-analysis', icon: Shield, label: 'Risk Analysis', description: 'Release safety score' },
    { id: 'security-debt', icon: TrendingUp, label: 'Security Debt', description: 'Vulnerability trends' },
    { id: 'priority', icon: Target, label: 'Priority Intelligence', description: 'Action plans' },
    { id: 'predictive', icon: Activity, label: 'Predictive Indicators', description: 'Health forecasts' },
    { id: 'assistant', icon: MessageSquare, label: 'AI Assistant', description: 'Ask anything' },
    { id: 'reports', icon: FileText, label: 'Report Center', description: 'Download reports' },
  ];

  return (
    <div className="w-72 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-white/20 bg-[#353535]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">DigiCert | RSI</h1>
            <p className="text-xs text-white/70">Release Security Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 bg-[#123A5A]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-white text-[#123A5A]'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#123A5A]' : ''}`} />
              <div className="text-left">
                <div className="font-medium">{item.label}</div>
                <div className={`text-xs ${isActive ? 'text-[#123A5A]/70' : 'text-white/60'}`}>
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Alerts */}
      <div className="p-4 border-t border-white/20 bg-[#353535]">
        <div className="bg-white/10 border border-white/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-300 mb-2">
            <Bell className="w-4 h-4" />
            <span className="font-medium">Active Alerts</span>
          </div>
          <div className="text-2xl font-bold text-white">3</div>
          <div className="text-xs text-white/70 mt-1">
            1 critical, 2 high priority
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/20 bg-[#353535]">
        <div className="flex items-center justify-between">
          <button className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10">
            <Settings className="w-5 h-5" />
          </button>
          <div className="text-xs text-white/60">v1.0.0</div>
          <button className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
