// frontend/src/pages/KanbanBoard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
  Search, Bell, Plus, Filter, Kanban as KanbanIcon, List, 
  AlertCircle, User, Clock, CheckCircle2, MapPin, Paperclip, MessageSquare 
} from 'lucide-react';
import api from '../services/api';

export default function KanbanBoard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'User', role: 'Staff' });
  const [tickets, setTickets] = useState([]);
  
  // Derived stats
  const highPriorityCount = tickets.filter(t => t.priority.includes('Urgent') || t.priority.includes('High')).length;
  const unassignedCount = tickets.filter(t => t.status === 'Open').length;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return navigate('/login');
    setUser(JSON.parse(storedUser));

    fetchTickets();
  }, [navigate]);

  const fetchTickets = () => {
    api.get('/tickets').then(res => setTickets(res.data)).catch(console.error);
  };

  // HTML5 Native Drag & Drop Handlers
  const handleDragStart = (e, ticketId) => {
    e.dataTransfer.setData('ticketId', ticketId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('ticketId');
    if (!ticketId) return;

    let assignedTech = null;
    
    // 1. Check if an Admin is moving it to "Assigned" or "In Progress"
    if (user.role === 'Admin' && (newStatus === 'In Progress' || newStatus === 'Assigned')) {
      const techName = window.prompt("Assign this ticket to which Technician? (e.g., John D.)");
      if (!techName) return; // Cancel drop if they don't assign anyone
      assignedTech = techName;
    }

    // 2. Optimistic UI update
    setTickets(prev => prev.map(t => 
      t.id.toString() === ticketId ? { ...t, status: newStatus, assigned_to: assignedTech || t.assigned_to } : t
    ));

    // 3. Update Database
    try {
      const payload = { status: newStatus };
      if (assignedTech) payload.assigned_to = assignedTech;
      
      await api.patch(`/tickets/${ticketId}/status`, payload);
    } catch (err) {
      console.error("Failed to update status", err);
      fetchTickets(); // Revert on failure
    }
  };

  const columns = [
    { title: 'Incoming', status: 'Open', color: 'bg-slate-400', dot: 'bg-slate-400' },
    { title: 'Assigned', status: 'Assigned', color: 'bg-blue-500', dot: 'bg-blue-500' },
    { title: 'In Progress', status: 'In Progress', color: 'bg-orange-500', dot: 'bg-orange-500' },
    { title: 'Completed', status: 'Resolved', color: 'bg-green-500', dot: 'bg-green-500' }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search tickets, rooms, or staff..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600"><Bell size={20} /></button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-medium">U</div>
              <div className="text-sm">
                <p className="font-semibold text-slate-700 leading-none">{user.name}</p>
                <p className="text-slate-500 text-xs mt-1">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 flex flex-col">
          {/* Top Title & Actions */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Maintenance Management</h1>
              <p className="text-slate-500 text-sm">Oversee campus facility issues and track repair progress across departments.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white shadow-sm rounded text-sm font-medium text-slate-700"><KanbanIcon size={16} /> Kanban</button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"><List size={16} /> List View</button>
              </div>
              <button onClick={() => navigate('/report')} className="px-4 py-2 bg-[#3B5998] text-white rounded-lg text-sm font-medium hover:bg-blue-800 flex items-center gap-2">
                <Plus size={16} /> Assign Ticket
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center"><AlertCircle size={20} /></div>
              <div>
                <p className="text-xs text-slate-500">High Priority</p>
                <h3 className="text-xl font-bold text-slate-900">{highPriorityCount}</h3>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><User size={20} /></div>
              <div>
                <p className="text-xs text-slate-500">Unassigned</p>
                <h3 className="text-xl font-bold text-slate-900">{unassignedCount < 10 ? `0${unassignedCount}` : unassignedCount}</h3>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center"><Clock size={20} /></div>
              <div>
                <p className="text-xs text-slate-500">Avg. Resolution</p>
                <h3 className="text-xl font-bold text-slate-900">4.2h</h3>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center"><CheckCircle2 size={20} /></div>
              <div>
                <p className="text-xs text-slate-500">Completed Today</p>
                <h3 className="text-xl font-bold text-slate-900">{tickets.filter(t => t.status === 'Resolved').length}</h3>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 mb-6">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border-r border-slate-200"><Filter size={16} /> Filters</button>
              <select className="bg-slate-50 border border-slate-200 text-sm rounded-md px-3 py-1.5 outline-none"><option>All Categories</option></select>
              <select className="bg-slate-50 border border-slate-200 text-sm rounded-md px-3 py-1.5 outline-none"><option>All Priorities</option></select>
              <select className="bg-slate-50 border border-slate-200 text-sm rounded-md px-3 py-1.5 outline-none"><option>All Staff</option></select>
            </div>
            <div className="flex items-center gap-4 pr-2 text-sm">
              <button className="text-slate-500 hover:text-slate-800">Clear All</button>
              <button className="flex items-center gap-2 border border-slate-200 px-3 py-1.5 rounded bg-white text-slate-700 font-medium"><Clock size={14} /> This Week</button>
            </div>
          </div>

          {/* Kanban Board Columns */}
          <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
            {columns.map(col => {
              const columnTickets = tickets.filter(t => t.status === col.status);
              
              return (
                <div 
                  key={col.title} 
                  className="bg-slate-50 rounded-xl border border-slate-200 flex flex-col min-w-[320px] max-w-[320px]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.status)}
                >
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${col.dot}`}></div>
                      <h3 className="font-semibold text-slate-800">{col.title}</h3>
                      <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{columnTickets.length}</span>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600"><Plus size={18} /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {columnTickets.map(ticket => (
                      <div 
                        key={ticket.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, ticket.id)}
                        className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-300 transition-colors"
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-slate-400">CF-{ticket.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            ticket.priority.includes('Urgent') ? 'bg-red-100 text-red-600' :
                            ticket.priority.includes('High') ? 'bg-orange-100 text-orange-600' :
                            ticket.priority.includes('Medium') ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-600'
                          }`}>
                            {ticket.priority.split(' ')[0]}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-2">{ticket.title}</h4>
                        
                        {/* Display Assigned Tech if available */}
                        {ticket.assigned_to && (
                          <div className="flex items-center gap-1 text-xs text-blue-600 mb-2 font-medium">
                            <User size={12} /> Assigned: {ticket.assigned_to}
                          </div>
                        )}

                        <div className="flex items-start gap-1 text-xs text-slate-500 mb-4">
                          <MapPin size={12} className="mt-0.5 shrink-0" />
                          <span className="line-clamp-1">{ticket.location}</span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock size={12} />
                            <span>{new Date(ticket.reported_date || Date.now()).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-400">
                            <div className="flex items-center gap-1"><Paperclip size={12} /> <span className="text-[10px]">1</span></div>
                            <div className="flex items-center gap-1"><MessageSquare size={12} /> <span className="text-[10px]">0</span></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Footer Bar */}
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> 12 Staff Online</span>
              <span>|</span>
              <span>System Latency: 42ms</span>
            </div>
            <div className="flex items-center gap-2">
              Last Sync: Just now
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}