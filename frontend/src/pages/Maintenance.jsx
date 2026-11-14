// frontend/src/pages/Maintenance.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, Calendar as CalendarIcon, Clock, CheckCircle, Wrench, User, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Maintenance() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Admin', role: 'Admin' });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [showModal, setShowModal] = useState(false);

  const [tasks, setTasks] = useState([
    { id: 'PM-201', task: 'Elevator Safety Inspection', asset: 'Elevator Car #2', frequency: 'Monthly', nextDue: 'Today', tech: 'John Kamau', status: 'Pending' },
    { id: 'PM-202', task: 'Fire Extinguisher Pressure Check', asset: 'All Academic Blocks', frequency: 'Quarterly', nextDue: 'Nov 20, 2026', tech: 'Safety Team', status: 'Scheduled' },
    { id: 'PM-203', task: 'Generator Oil & Filter Change', asset: 'Backup Generator B', frequency: 'Bi-Annual', nextDue: 'Nov 25, 2026', tech: 'Sarah Ochieng', status: 'Scheduled' },
    { id: 'PM-204', task: 'HVAC Filter Replacement', asset: 'Main Library HVAC', frequency: 'Monthly', nextDue: 'Nov 02, 2026', tech: 'John Kamau', status: 'Completed' },
  ]);

  const [newTask, setNewTask] = useState({ task: '', asset: '', frequency: 'Monthly', nextDue: 'Nov 28, 2026', tech: 'John Kamau' });

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return navigate('/login');
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nextStatus = t.status === 'Completed' ? 'Scheduled' : 'Completed';
      return { ...t, status: nextStatus };
    }));
  };

  const handleScheduleTask = (e) => {
    e.preventDefault();
    const nextId = `PM-${201 + tasks.length}`;
    setTasks(prev => [...prev, { ...newTask, id: nextId, status: 'Scheduled' }]);
    setShowModal(false);
    setNewTask({ task: '', asset: '', frequency: 'Monthly', nextDue: 'Nov 28, 2026', tech: 'John Kamau' });
  };

  const filteredTasks = tasks.filter(t => 
    t.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tech.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = tasks.filter(t => t.status !== 'Completed').length;

  const userInitials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search schedules, assets, or technicians..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600"><Bell size={20} /></button>
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

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">Preventive Maintenance</h1>
              <p className="text-slate-500">Manage recurring schedules and routine campus safety inspections.</p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} /> Schedule Routine
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  List View
                </button>
                <button 
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Calendar View
                </button>
              </div>
              <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
                <Clock size={16} className="text-blue-600" /> {pendingCount} Active Routines Scheduled
              </div>
            </div>
            
            {viewMode === 'list' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-xs uppercase text-slate-500">
                    <th className="px-6 py-4 font-semibold">Routine Task</th>
                    <th className="px-6 py-4 font-semibold">Target Asset</th>
                    <th className="px-6 py-4 font-semibold">Frequency</th>
                    <th className="px-6 py-4 font-semibold">Next Due</th>
                    <th className="px-6 py-4 font-semibold">Assigned Tech</th>
                    <th className="px-6 py-4 font-semibold text-right">Status (Click to Toggle)</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg transition-colors ${task.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                            {task.status === 'Completed' ? <CheckCircle size={16} /> : <Wrench size={16} />}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{task.task}</p>
                            <p className="text-xs text-slate-500">{task.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{task.asset}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5"><CalendarIcon size={14} className="text-slate-400"/> {task.frequency}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${task.nextDue === 'Today' ? 'text-red-600 font-bold' : 'text-slate-700'}`}>{task.nextDue}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center"><User size={12}/></div>
                          {task.tech}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-transform active:scale-95 ${
                            task.status === 'Completed' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                            task.status === 'Pending' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
                            'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {task.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* Calendar Grid View */
              <div className="p-6 grid grid-cols-4 gap-4">
                {filteredTasks.map(task => (
                  <div key={task.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-600">{task.nextDue}</span>
                      <h4 className="font-semibold text-slate-900 mt-1 mb-1">{task.task}</h4>
                      <p className="text-xs text-slate-500 mb-3">{task.asset} • {task.frequency}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/70 text-xs">
                      <span className="text-slate-600 font-medium">{task.tech}</span>
                      <span className={`px-2 py-0.5 rounded-full font-medium ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Schedule Routine Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-md shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Schedule Preventive Routine</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleScheduleTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Routine Task Title</label>
                  <input type="text" required value={newTask.task} onChange={e => setNewTask({...newTask, task: e.target.value})} placeholder="e.g. Solar Battery Bank Inspection" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Target Campus Asset</label>
                  <input type="text" required value={newTask.asset} onChange={e => setNewTask({...newTask, asset: e.target.value})} placeholder="e.g. Science Block Rooftop" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Frequency</label>
                    <select value={newTask.frequency} onChange={e => setNewTask({...newTask, frequency: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Bi-Annual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Next Due Date</label>
                    <input type="text" required value={newTask.nextDue} onChange={e => setNewTask({...newTask, nextDue: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Assign Technician</label>
                  <input type="text" required value={newTask.tech} onChange={e => setNewTask({...newTask, tech: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Save Schedule</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}