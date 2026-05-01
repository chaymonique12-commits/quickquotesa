import { Home, FileText, History, Settings } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import type { TabType } from '../types';

const tabs: { id: TabType; label: string; icon: typeof Home; badge?: boolean }[] = [
  { id: 'builder', label: 'Home', icon: Home },
  { id: 'templates', label: 'Templates', icon: FileText, badge: true },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function TabBar() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-full h-full touch-manipulation"
            >
              <div
                className={`transition-colors duration-150 ${
                  isActive ? 'text-primary' : 'text-gray-500'
                }`}
              >
                <Icon size={24} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
                )}
              </div>
              <span
                className={`text-xs mt-1 ${
                  isActive ? 'text-primary font-semibold' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function Sidebar() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex-col z-40">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <FileText size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg text-secondary">QuickQuote</h1>
            <p className="text-xs text-text-secondary">South Africa</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors touch-manipulation ${
                isActive ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}