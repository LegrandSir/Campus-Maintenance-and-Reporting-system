// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Plus, Clock, CheckCircle, AlertTriangle, 
  MoreHorizontal, FileText, Filter, Image as ImageIcon, UserCheck
} from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Paul Wafula', role: 'Student' });
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ active: 0, resolved: 0, total: 0, avg_response: '2.4h' });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(4);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const calculateScreenFit = () => {
      const availableHeight = window.innerHeight - 450;
      const ticketCardHeight = 110; 
      let fitCount = Math.floor(availableHeight / ticketCardHeight);
      
      if (fitCount < 4) fitCount = 4;
      setVisibleCount(fitCount);
    };

    calculateScreenFit();
    window.addEventListener('resize', calculateScreenFit);
    return () => window.removeEventListener('resize', calculateScreenFit);
  }, []);
  
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return navigate('/login');
    setUser(JSON.parse(storedUser));

    api.get('/tickets/stats').then(res => setStats(res.data)).catch(console.error);
    
    api.get('/tickets').then(res => setTickets(res.data)).catch(() => {
      setTickets([
        { id: 1024, title: 'Water Leakage in Freida brown bath...', location: '2nd Floor, Bathroom 4', priority: 'Urgent Priority', status: 'In Progress', date: '2023-10-24' },
        { id: 1025, title: 'Broken AC Unit in Lab 4', location: 'lilian beam k Ground Floor', priority: 'High Priority', status: 'Open', date: '2023-10-25' },
        { id: 1018, title: 'Projector Bulb Replacement Needed', location: 'School of business, LT2', priority: 'Medium Priority', status: 'Resolved', date: '2023-10-18' },
        { id: 1026, title: 'Broken glass door', location: 'Humanities Wing, Entrance', priority: 'Low Priority', status: 'Open', date: '2023-10-26' },
      ]);
    });
  }, [navigate]);

  // Cycle through status filters when clicking the Filter button
  const cycleFilter = () => {
    const modes = ['All', 'Open', 'Assigned', 'In Progress', 'Resolved'];
    const nextIndex = (modes.indexOf(statusFilter) + 1) % modes.length;
    setStatusFilter(modes[nextIndex]);
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const displayedTickets = filteredTickets.slice(0, visibleCount);

  // Live dynamic counts for the Status Overview widget & top cards
  const totalCount = tickets.length;
  const openCount = tickets.filter(t => t.status === 'Open' || t.status === 'Assigned').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;
  const activeCount = openCount + inProgressCount;

  const completionRate = totalCount > 0 
    ? Math.round((resolvedCount / totalCount) * 100) 
    : 100;

  const getPercent = (count) => totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

  const userInitials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tickets, rooms, or #ID..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
            />
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/tickets')}
              className="relative text-slate-400 hover:text-slate-600 transition-colors"
              title="View notifications"
            >
              <Bell size={20} />
              {activeCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>
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

        {/* Dashboard Body */}
        <div className="flex-1 overflow-auto p-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">Welcome back, {user.name.split(' ')[0]}</h1>
              <p className="text-slate-500">Monitor and manage your campus maintenance requests in real time.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/tickets')} 
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Clock size={16} /> Request History
              </button>
              <button 
                onClick={() => navigate('/report')} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:scale-[0.98] shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                <Plus size={16} /> New Ticket
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4"><AlertTriangle size={20} /></div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Active Requests</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1 mb-2">{activeCount}</h3>
              <p className="text-sm text-slate-500">Tickets currently being handled</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center"><CheckCircle size={20} /></div>
                <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">+{resolvedCount} this term</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Resolved</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1 mb-2">{resolvedCount}</h3>
              <p className="text-sm text-slate-500">Successfully fixed issues</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4"><Clock size={20} /></div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Avg. Response</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1 mb-2">{stats.avg_response || '2.4h'}</h3>
              <p className="text-sm text-slate-500">Time to initial assessment</p>
            </div>

            <div className="bg-[#3B5998] p-6 rounded-xl text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider">System Health</span>
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Stable
                </span>
              </div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm">Maintenance Progress</span>
                <span className="text-xl font-bold">{completionRate}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 mb-4 overflow-hidden">
                <div className="bg-white h-1.5 rounded-full transition-all duration-700" style={{ width: `${completionRate}%` }}></div>
              </div>
              <p className="text-xs text-blue-100">{resolvedCount} of {totalCount} issues resolved campus-wide.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Tickets List */}
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-slate-900">Recent Tickets</h2>
                  {statusFilter !== 'All' && (
                    <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full">
                      Showing: {statusFilter}
                    </span>
                  )}
                </div>
                <div className="flex gap-4 text-sm font-medium text-slate-600">
                  <button 
                    onClick={cycleFilter} 
                    className="flex items-center gap-1 hover:text-slate-900 transition-colors"
                  >
                    <Filter size={16} /> Filter ({statusFilter})
                  </button>
                  <span className="text-slate-300">|</span>
                  <button 
                    onClick={() => setVisibleCount(filteredTickets.length || 10)} 
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View All ({filteredTickets.length})
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {displayedTickets.map((t) => (
                  <div 
                    key={t.id} 
                    className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="flex items-start gap-4">
                      {t.image_url ? (
                        <img 
                          src={t.image_url} 
                          alt={t.title} 
                          onClick={() => navigate(`/ticket/${t.id}`)}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 mt-0.5 cursor-pointer hover:opacity-90"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <FileText size={20} />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 
                            onClick={() => navigate(`/ticket/${t.id}`)}
                            className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                          >
                            {t.title}
                          </h4>
                          <span className="text-xs text-slate-400">#{t.id}</span>
                          {t.image_url && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              <ImageIcon size={11} /> Photo
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mb-3">{t.location}</p>
                        <div className="flex items-center gap-4 text-xs font-medium">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock size={14} /> Reported: {t.reported_date ? new Date(t.reported_date).toLocaleDateString() : t.date}
                          </span>
                          <span className={`flex items-center gap-1 ${
                            t.priority?.includes('Urgent') ? 'text-red-600' : 
                            t.priority?.includes('High') ? 'text-orange-500' : 
                            t.priority?.includes('Medium') ? 'text-blue-600' : 'text-slate-500'
                          }`}>
                            <AlertTriangle size={14} /> {t.priority}
                          </span>
                          {t.assigned_to && (
                            <span className="text-emerald-600 flex items-center gap-1">
                              <UserCheck size={14} /> {t.assigned_to}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        t.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : 
                        t.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                        t.status === 'Assigned' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {t.status}
                      </span>
                      <button 
                        onClick={() => navigate(`/ticket/${t.id}`)} 
                        className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1"
                      >
                        Details &gt;
                      </button>
                      
                      {/* Action Menu (3 Dots) */}
                      <div className="relative">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === t.id ? null : t.id)}
                          className="p-1 text-slate-400 hover:bg-slate-100 rounded transition-colors"
                        >
                          <MoreHorizontal size={20} />
                        </button>
                        
                        {activeDropdown === t.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10">
                            <button 
                              onClick={() => {
                                setActiveDropdown(null);
                                navigate(`/ticket/${t.id}`);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              View Ticket
                            </button>
                            <button 
                              onClick={async () => {
                                if(window.confirm('Are you sure you want to delete this ticket?')) {
                                  try {
                                    await api.delete(`/tickets/${t.id}`);
                                    setTickets(tickets.filter(ticket => ticket.id !== t.id));
                                  } catch (err) {
                                    console.error("Failed to delete ticket", err);
                                  }
                                }
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Delete Ticket
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredTickets.length > visibleCount && (
                <button 
                  onClick={() => setVisibleCount(prev => prev + 4)} 
                  className="w-full mt-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 flex justify-center items-center gap-2 transition-colors"
                >
                  Load more activities &rarr;
                </button>
              )}
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-6">
              {/* Dynamic Status Overview */}
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-1">Status Overview</h3>
                <p className="text-sm text-slate-500 mb-6">Real-time breakdown of campus reports.</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-400"></span>In Progress</span>
                      <span className="font-semibold text-slate-700">{inProgressCount}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-orange-400 h-1.5 rounded-full transition-all duration-700" style={{ width: `${getPercent(inProgressCount)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Open / Assigned</span>
                      <span className="font-semibold text-slate-700">{openCount}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${getPercent(openCount)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Resolved</span>
                      <span className="font-semibold text-slate-700">{resolvedCount}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-green-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${getPercent(resolvedCount)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2 text-blue-700"><AlertTriangle size={18} /> Campus Notice</h3>
                <div className="bg-white p-4 rounded-lg border border-slate-100 mb-3 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 mb-1">WATER MAIN REPAIR</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Scheduled maintenance in South Quad from 10 PM tonight. Expect low water pressure.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 mb-1">NEW REPORTING TOOL</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">CampusFix v2.4 is now live with camera capture and image attachments for faster diagnosis.</p>
                </div>
              </div>

              <div className="bg-[#0B1739] p-6 rounded-xl text-white">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">Our facility management team is available 24/7 for emergency repairs.</p>
                <button 
                  onClick={() => navigate('/help')}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Contact Facility Desk &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}