import { LucideIcon } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface DashboardTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'muted';
  className?: string;
}

export function DashboardTabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'default',
  className = ''
}: DashboardTabsProps) {
  const containerBg = variant === 'muted' ? 'bg-muted' : 'bg-muted';
  const activeStyles = 'bg-background text-foreground shadow-sm';
  const inactiveStyles = 'text-muted-foreground hover:text-foreground';

  return (
    <div className={`flex space-x-1 mb-8 ${containerBg} p-1 rounded-lg w-fit ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id ? activeStyles : inactiveStyles
          }`}
        >
          <tab.icon className="w-4 h-4 mr-2" />
          {tab.label}
        </button>
      ))}
    </div>
  );
}