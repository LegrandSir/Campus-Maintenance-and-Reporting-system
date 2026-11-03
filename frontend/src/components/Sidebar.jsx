import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plus, FileText, Kanban, Settings, HelpCircle, LogOut, Package, Monitor, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState('Student'); // Default to Student

  useEffect(() => {
    // Read the actual user role from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserRole(JSON.parse(storedUser).role);
    }
  }, []);

  const isActive = (path) => location.pathname === path ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-800/50";

  return (
    <aside className="w-64 bg-[#0B1739] text-white flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">CF</div>
        <span className="text-xl font-bold tracking-wide">CampusFix</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <button onClick={() => navigate('/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/dashboard')}`}>
          <LayoutDashboard size={20} /> Dashboard
        </button>
        <button onClick={() => navigate('/report')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/report')}`}>
          <Plus size={20} /> Report Issue
        </button>
        <button onClick={() => navigate('/tickets')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/tickets')}`}>
          <FileText size={20} /> My Tickets
        </button>
        
       {/* STAFF & ADMIN Shared Tools */}
        {(userRole === 'Staff' || userRole === 'Admin' || userRole === 'Maintenance') && (
          <>
            <button onClick={() => navigate('/kanban')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/kanban')}`}>
              <Kanban size={20} /> Kanban Board
            </button>
            <button onClick={() => navigate('/inventory')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/inventory')}`}>
              <Package size={20} /> Inventory
            </button>
          </>
        )}

        {/* ADMIN ONLY Tools */}
        {userRole === 'Admin' && (
          <>
            <button onClick={() => navigate('/assets')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/assets')}`}>
              <Monitor size={20} /> Assets
            </button>
            <button onClick={() => navigate('/maintenance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/maintenance')}`}>
              <Calendar size={20} /> Maintenance
            </button>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-blue-900/50 space-y-2">
        {/* ONLY show Settings for Admins */}
        {userRole === 'Admin' && (
          <button className="w-full flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-blue-800/50 rounded-xl transition-colors">
            <Settings size={20} /> Settings
          </button>
        )}
        <button className="w-full flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-blue-800/50 rounded-xl transition-colors">
          <HelpCircle size={20} /> Help
        </button>
        <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-4">
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </aside>
  );
}