// frontend/src/components/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, FileText, Kanban, Settings, HelpCircle, LogOut, Building2 } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Report Issue', path: '/report', icon: <Plus size={18} /> },
    { name: 'My Tickets', path: '/tickets', icon: <FileText size={18} /> },
    { name: 'Kanban Board', path: '/kanban', icon: <Kanban size={18} /> },
  ];

  return (
    <aside className="w-64 bg-[#0B1739] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-500 p-1.5 rounded"><Building2 size={20} /></div>
          <span className="text-xl font-semibold">CampusFix</span>
        </div>
        <nav className="px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-900/50 text-white border-l-4 border-blue-500' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.icon} {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 space-y-1 mb-4">
        <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white"><Settings size={18} /> Settings</a>
        <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white"><HelpCircle size={18} /> Help</a>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg mt-2 transition-colors">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}