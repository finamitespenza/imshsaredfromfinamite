import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { SkuMaster } from './pages/SkuMaster';
import { Transactions } from './pages/Transactions';
import { Suppliers } from './pages/Suppliers';
import { Warehouses } from './pages/Warehouses';
import { SkuVendorMapping } from './pages/SkuVendorMapping';
import { Reports } from './pages/Reports';
import { Package2, LayoutDashboard, BarChart3, RefreshCw, Truck, Building2, Link } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'skuMaster', label: 'SKU Master', icon: <Package2 className="w-5 h-5" /> },
  { id: 'transactions', label: 'Transactions', icon: <RefreshCw className="w-5 h-5" /> },
  { id: 'suppliers', label: 'Suppliers', icon: <Truck className="w-5 h-5" /> },
  { id: 'warehouses', label: 'Warehouses', icon: <Building2 className="w-5 h-5" /> },
  { id: 'skuVendorMapping', label: 'SKU to Vendor Mapping', icon: <Link className="w-5 h-5" /> },
  { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
];

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        navItems={navItems} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        collapsed={sidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
      />
      
      <div className={`flex-1 transition-all duration-300 overflow-auto ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'skuMaster' && <SkuMaster />}
        {activeSection === 'transactions' && <Transactions />}
        {activeSection === 'suppliers' && <Suppliers />}
        {activeSection === 'warehouses' && <Warehouses />}
        {activeSection === 'skuVendorMapping' && <SkuVendorMapping />}
        {activeSection === 'reports' && <Reports />}
      </div>
    </div>
  );
}

export default App;