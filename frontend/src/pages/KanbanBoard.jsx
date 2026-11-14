// frontend/src/pages/KanbanBoard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
  Search, Bell, Plus, Filter, Kanban as KanbanIcon, List, 
  AlertCircle, User, Clock, CheckCircle2, MapPin, Paperclip, MessageSquare, Image as ImageIcon 
} from 'lucide-react';
import api from '../services/api';

export default function KanbanBoard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'User', role: 'Staff' });
  const [tickets, setTickets] = useState([]);
  
  // Interactive Filter & View States
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [staffFilter, setStaffFilter] = useState('All Staff');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [dragOverCol, setDragOverCol] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return navigate('/login');
    setUser(JSON.parse(storedUser));

    fetchTickets();
  }, [navigate]);

  const fetchTickets = () => {
    api.get('/tickets').then(res => setTickets(res.data)).catch(console.error);
  };

  const handleDragStart = (e, ticketId) => {
    e.dataTransfer.setData('ticketId', ticketId);
  };

  const handleDragOver = (e, colStatus) => {
    e.preventDefault();
    if (dragOverCol !== colStatus) setDragOverCol(colStatus);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const ticketId = e.dataTransfer.getData('ticketId');
    if (!ticketId) return;

    const draggedTicket = tickets.find(t => t.id.toString() === ticketId);
    if (!draggedTicket) return;

    let assignedTech = draggedTicket.assigned_to;
    
    // Only prompt IF Admin/Maintenance, moving to Assigned/In Progress, and NO ONE is assigned yet
    if ((user.role === 'Admin' || user.role === 'Maintenance') && (newStatus === 'Assigned' || newStatus === 'In Progress') && !assignedTech) {
      const techName = window.prompt("Assign this ticket to which Technician? (e.g., John Kamau)");
      if (!techName) return; 
      assignedTech = techName;
    }

    setTickets(prev => prev.map(t => 
      t.id.toString() === ticketId ? { ...t, status: newStatus, assigned_to: assignedTech } : t
    ));

    try {
      const payload = { status: newStatus };
      if (assignedTech !== draggedTicket.assigned_to) payload.assigned_to = assignedTech;
      
      await api.patch(`/tickets/${ticketId}/status`, payload);
    } catch (err) {
      console.error("Failed to update status", err);
      fetchTickets();
    }
  };

  // Dynamic Filter Logic
  const uniqueStaff = Array.from(new Set(tickets.map(t => t.assigned_to).filter(Boolean)));

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id?.toString().includes(searchTerm);
    const matchesPriority = priorityFilter === 'All Priorities' || t.priority?.includes(priorityFilter);
    const matchesStaff = staffFilter === 'All Staff' || 
      (staffFilter === 'Unassigned' ? !t.assigned_to : t.assigned_to === staffFilter);

    return matchesSearch && matchesPriority && matchesStaff;
  });

  const highPriorityCount = tickets.filter(t => t.priority?.includes('Urgent') || t.priority?.includes('High')).length;
  const unassignedCount = tickets.filter(t => t.status === 'Open').length;

  const columns = [
    { title: 'Incoming', status: 'Open', color: 'bg-slate-400', dot: 'bg-slate-400' },
    { title: 'Assigned', status: 'Assigned', color: 'bg-blue-500', dot: 'bg-blue-500' },
    { title: 'In Progress', status: 'In Progress', color: 'bg-orange-500', dot: 'bg-orange-500' },
    { title: 'Completed', status: 'Resolved', color: 'bg-green-500', dot: 'bg-green-500' }
  ];

  const userInitials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tickets, rooms, or staff..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors"><Bell size={20} /></button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">
                {userInitials}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-700 leading-none">{user.name}</p>
                <p className="text-slate-500 text-xs mt-1">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 flex flex-col">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Maintenance Management</h1>
              <p className="text-slate-500 text-sm">Oversee campus facility issues and drag cards to update repair progress in real time.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button 
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    viewMode === 'kanban' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <KanbanIcon size={16} /> Kanban
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <List size={16} /> List View
                </button>
              </div>
              <button 
                onClick={() => navigate('/report')} 
                className="px-4 py-2 bg-[#3B5998] text-white rounded-lg text-sm font-medium hover:bg-blue-800 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus size={16} /> New Ticket
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-sm transition-all flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center"><AlertCircle size={20} /></div>
              <div>
                <p className="text-xs text-slate-500">High / Urgent Priority</p>
                <h3 className="text-xl font-bold text-slate-900">{highPriorityCount}</h3>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-sm transition-all flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><User size={20} /></div>
              <div>
                <p className="text-xs text-slate-500">Unassigned</p>
                <h3 className="text-xl font-bold text-slate-900">{unassignedCount < 10 ? `0${unassignedCount}` : unassignedCount}</h3>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-sm transition-all flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center"><Clock size={20} /></div>
              <div>
                <p className="text-xs text-slate-500">Avg. Resolution</p>
                <h3 className="text-xl font-bold text-slate-900">2.4h</h3>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-sm transition-all flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center"><CheckCircle2 size={20} /></div>
              <div>
                <p className="text-xs text-slate-500">Completed</p>
                <h3 className="text-xl font-bold text-slate-900">{tickets.filter(t => t.status === 'Resolved').length}</h3>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 mb-6">
            <div className="flex gap-2 items-center">
              <span className="flex items-center gap-2 px-4 py-1.5 text-sm text-slate-600 border-r border-slate-200 font-medium">
                <Filter size={16} /> Filters
              </span>
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-sm rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Priorities">All Priorities</option>
                <option value="Urgent">Urgent Priority</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
              <select 
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-sm rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Staff">All Staff</option>
                <option value="Unassigned">Unassigned Only</option>
                {uniqueStaff.map(staff => (
                  <option key={staff} value={staff}>{staff}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4 pr-2 text-sm">
              <button 
                onClick={() => { setSearchTerm(''); setPriorityFilter('All Priorities'); setStaffFilter('All Staff'); }}
                className="text-slate-500 hover:text-blue-600 font-medium transition-colors"
              >
                Clear All
              </button>
              <span className="flex items-center gap-2 border border-slate-200 px-3 py-1.5 rounded bg-slate-50 text-slate-700 font-medium">
                <Clock size={14} /> Active Term
              </span>
            </div>
          </div>

          {viewMode === 'kanban' ? (
            <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
              {columns.map(col => {
                const columnTickets = filteredTickets.filter(t => t.status === col.status);
                const isOver = dragOverCol === col.status;
                
                return (
                  <div 
                    key={col.title} 
                    className={`bg-slate-50 rounded-xl border-2 flex flex-col min-w-[310px] max-w-[310px] transition-colors ${
                      isOver ? 'border-blue-400 bg-blue-50/40' : 'border-slate-200'
                    }`}
                    onDragOver={(e) => handleDragOver(e, col.status)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, col.status)}
                  >
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`}></div>
                        <h3 className="font-semibold text-slate-800">{col.title}</h3>
                        <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{columnTickets.length}</span>
                      </div>
                      <button onClick={() => navigate('/report')} className="text-slate-400 hover:text-blue-600 transition-colors"><Plus size={18} /></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {columnTickets.map(ticket => (
                        <div 
                          key={ticket.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, ticket.id)}
                          className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                          onClick={() => navigate(`/ticket/${ticket.id}`)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium text-slate-400">CF-{ticket.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              ticket.priority?.includes('Urgent') ? 'bg-red-100 text-red-600' :
                              ticket.priority?.includes('High') ? 'bg-orange-100 text-orange-600' :
                              ticket.priority?.includes('Medium') ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-600'
                            }`}>
                              {ticket.priority?.split(' ')[0]}
                            </span>
                          </div>

                          {ticket.image_url && (
                            <img 
                              src={ticket.image_url} 
                              alt={ticket.title} 
                              className="w-full h-24 object-cover rounded-md mb-2.5 border border-slate-100"
                            />
                          )}

                          <h4 className="text-sm font-semibold text-slate-900 mb-2">{ticket.title}</h4>
                          
                          {ticket.assigned_to && (
                            <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50/80 px-2 py-1 rounded mb-2 font-medium w-max">
                              <User size={12} /> Assigned: {ticket.assigned_to}
                            </div>
                          )}

                          <div className="flex items-start gap-1 text-xs text-slate-500 mb-3">
                            <MapPin size={12} className="mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{ticket.location}</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Clock size={12} />
                              <span>{new Date(ticket.reported_date || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                              {ticket.image_url && (
                                <div className="flex items-center gap-1 text-blue-500"><ImageIcon size={12} /></div>
                              )}
                              <div className="flex items-center gap-1"><Paperclip size={12} /> <span className="text-[10px]">1</span></div>
                              <div className="flex items-center gap-1"><MessageSquare size={12} /> <span className="text-[10px]">1</span></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View Fallback */
            <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                    <th className="px-6 py-4 font-semibold">Ticket</th>
                    <th className="px-6 py-4 font-semibold">Location</th>
                    <th className="px-6 py-4 font-semibold">Priority</th>
                    <th className="px-6 py-4 font-semibold">Assigned To</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredTickets.map(t => (
                    <tr key={t.id} onClick={() => navigate(`/ticket/${t.id}`)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">CF-{t.id}: {t.title}</td>
                      <td className="px-6 py-4 text-slate-600">{t.location}</td>
                      <td className="px-6 py-4">{t.priority}</td>
                      <td className="px-6 py-4 text-blue-600 font-medium">{t.assigned_to || 'Unassigned'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{t.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> 12 Staff Online</span>
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