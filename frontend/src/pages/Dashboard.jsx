// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Plus, Clock, CheckCircle, AlertTriangle, 
  MoreHorizontal, LayoutDashboard, FileText, Kanban, 
  Settings, HelpCircle, LogOut, Building2, Filter 
} from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Paul Wafula', role: 'Student' });
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return navigate('/login');
    setUser(JSON.parse(storedUser));

    // Fetch live tickets (Falls back to the exact UI screenshot data if API fails)
    api.get('/tickets').then(res => setTickets(res.data)).catch(() => {
      setTickets([
        { id: '#TKT-1024', title: 'Water Leakage in Freida brown bath...', location: '2nd Floor, Bathroom 4', priority: 'Urgent Priority', status: 'In Progress', date: '2023-10-24' },
        { id: '#TKT-1025', title: 'Broken AC Unit in Lab 4', location: 'lilian beam k Ground Floor', priority: 'High Priority', status: 'Open', date: '2023-10-25' },
        { id: '#TKT-1018', title: 'Projector Bulb Replacement Needed', location: 'School of business, LT2', priority: 'Medium Priority', status: 'Resolved', date: '2023-10-18' },
        { id: '#TKT-1026', title: 'Broken glass door', location: 'Humanities Wing, Entrance', priority: 'Low Priority', status: 'Open', date: '2023-10-26' },
      ]);
    });
  }, [navigate]);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1739] text-white flex flex-col justify-between">
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="bg-blue-500 p-1.5 rounded"><Building2 size={20} /></div>
            <span className="text-xl font-semibold">CampusFix</span>
          </div>
          <nav className="px-4 space-y-1 mt-4">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-900/50 text-white rounded-lg border-l-4 border-blue-500"><LayoutDashboard size={18} /> Dashboard</a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white"><Plus size={18} /> Report Issue</a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white"><FileText size={18} /> My Tickets</a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white"><Kanban size={18} /> Kanban Board</a>
          </nav>
        </div>
        <div className="p-4 space-y-1 mb-4">
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white"><Settings size={18} /> Settings</a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white"><HelpCircle size={18} /> Help</a>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg mt-2"><LogOut size={18} /> Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search tickets, rooms, or staff..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600"><Bell size={20} /><span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span></button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-medium">U</div>
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
              <p className="text-slate-500">Monitor and manage your campus maintenance requests.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 flex items-center gap-2"><Clock size={16} /> Request History</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"><Plus size={16} /> New Ticket</button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4"><AlertTriangle size={20} /></div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Active Requests</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1 mb-2">3</h3>
              <p className="text-sm text-slate-500">Tickets currently being handled</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center"><CheckCircle size={20} /></div>
                <span className="text-sm font-medium text-slate-900">+2 this week</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Resolved</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1 mb-2">1</h3>
              <p className="text-sm text-slate-500">Successfully fixed issues</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4"><Clock size={20} /></div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Avg. Response</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1 mb-2">2.4h</h3>
              <p className="text-sm text-slate-500">Time to initial assessment</p>
            </div>
            <div className="bg-[#3B5998] p-6 rounded-xl text-white">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider">System Health</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Stable</span>
              </div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm">Maintenance Progress</span>
                <span className="text-xl font-bold">88%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 mb-4"><div className="bg-white w-[88%] h-1.5 rounded-full"></div></div>
              <p className="text-xs text-blue-100">9.2k issues resolved campus-wide this term.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Tickets List */}
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-900">Recent Tickets</h2>
                <div className="flex gap-4 text-sm font-medium text-slate-600">
                  <button className="flex items-center gap-1 hover:text-slate-900"><Filter size={16} /> Filter</button>
                  <span className="text-slate-300">|</span>
                  <button className="text-blue-600 hover:text-blue-700">View All</button>
                </div>
              </div>
              
              <div className="space-y-4">
                {tickets.map((t, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 mt-1"><FileText size={20} /></div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">{t.title}</h4>
                          <span className="text-xs text-slate-400">{t.id}</span>
                        </div>
                        <p className="text-sm text-slate-500 mb-3">{t.location}</p>
                        <div className="flex items-center gap-4 text-xs font-medium">
                          <span className="text-slate-400 flex items-center gap-1"><Clock size={14} /> Reported: {t.date}</span>
                          <span className={`flex items-center gap-1 ${t.priority.includes('Urgent') ? 'text-red-600' : t.priority.includes('High') ? 'text-orange-500' : t.priority.includes('Medium') ? 'text-blue-600' : 'text-slate-500'}`}>
                            <AlertTriangle size={14} /> {t.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : t.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {t.status}
                      </span>
                      <button className="text-sm font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1">Details &gt;</button>
                      <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 flex justify-center items-center gap-2">Load more activities &rarr;</button>
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-1">Status Overview</h3>
                <p className="text-sm text-slate-500 mb-6">Real-time breakdown of your reports.</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-400"></span>In Progress</span><span className="font-semibold text-slate-700">2</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-[#3B5998] w-1/2 h-1.5 rounded-full"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Open</span><span className="font-semibold text-slate-700">1</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-[#3B5998] w-1/4 h-1.5 rounded-full"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Resolved</span><span className="font-semibold text-slate-700">1</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-[#3B5998] w-1/4 h-1.5 rounded-full"></div></div>
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
                  <p className="text-xs text-slate-500 leading-relaxed">CampusFix v2.4 is now live with enhanced image attachments for better issue diagnosis.</p>
                </div>
              </div>

              <div className="bg-[#0B1739] p-6 rounded-xl text-white">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">Our facility management team is available 24/7 for emergency repairs.</p>
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-2.5 rounded-lg text-sm font-medium transition-colors">Contact Facility Desk &rarr;</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}