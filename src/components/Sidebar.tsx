import { ReactNode } from 'react';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
  activeSection: string;
  setActiveSection: (section: string) => void;
  collapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ 
  navItems, 
  activeSection, 
  setActiveSection, 
  collapsed, 
  toggleSidebar 
}: SidebarProps) {
  return (
    <div 
      className={`fixed h-full bg-white border-r border-gray-200 transition-all duration-300 z-10 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200">
        {!collapsed && (
          <span className="text-xl font-bold text-indigo-600">IMS</span>
        )}
        {collapsed && (
          <span className="mx-auto text-xl font-bold text-indigo-600">
            <Package size={24} />
          </span>
        )}
        <button 
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight className="text-gray-600" /> : <ChevronLeft className="text-gray-600" />}
        </button>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            data-section={item.id}
            className={`nav-item flex items-center space-x-3 w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeSection === item.id
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="sidebar-text">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}