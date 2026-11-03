import { useState } from 'react';
import { Search, Bell, Plus, Calendar as CalendarIcon, Clock, CheckCircle, Wrench, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Maintenance() {
  const [searchTerm, setSearchTerm] = useState('');

  const tasks = [
    { id: 'PM-201', task: 'Elevator Safety Inspection', asset: 'Elevator Car #2', frequency: 'Monthly', nextDue: 'Today', tech: 'John D.', status: 'Pending' },
    { id: 'PM-202', task: 'Fire Extinguisher Pressure Check', asset: 'All Blocks', frequency: 'Quarterly', nextDue: 'Nov 5, 2026', tech: 'Safety Team', status: 'Scheduled' },
    { id: 'PM-203', task: 'Generator Oil Change', asset: 'Backup Generator B', frequency: 'Bi-Annual', nextDue: 'Nov 12, 2026', tech: 'Alex M.', status: 'Scheduled' },
    { id: 'PM-204', task: 'HVAC Filter Replacement', asset: 'Main Library HVAC', frequency: 'Monthly', nextDue: 'Oct 15, 2026', tech: 'John D.', status: 'Completed' },
  ];

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
              placeholder="Search schedules or tasks..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600"><Bell size={20} /></button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-medium">U</div>
              <div className="text-sm">
                <p className="font-semibold text-slate-700 leading-none">Paul Wafula</p>
                <p className="text-slate-500 text-xs mt-1">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">Preventive Maintenance</h1>
              <p className="text-slate-500">Manage recurring schedules and routine campus inspections.</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
              <Plus size={16} /> Schedule Routine
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="px-4 py-1.5 bg-white shadow-sm rounded-md text-sm font-medium text-slate-900">List View</button>
                <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">Calendar View</button>
              </div>
              <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
                <Clock size={16} /> 12 Tasks Due This Week
              </div>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-6 py-4 font-semibold">Routine Task</th>
                  <th className="px-6 py-4 font-semibold">Target Asset</th>
                  <th className="px-6 py-4 font-semibold">Frequency</th>
                  <th className="px-6 py-4 font-semibold">Next Due</th>
                  <th className="px-6 py-4 font-semibold">Assigned Tech</th>
                  <th className="px-6 py-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${task.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                          {task.status === 'Completed' ? <CheckCircle size={16} /> : <Wrench size={16} />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{task.task}</p>
                          <p className="text-xs text-slate-500">{task.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{task.asset}</td>
                    <td className="px-6 py-4 text-slate-600 flex items-center gap-1"><CalendarIcon size={14} className="text-slate-400"/> {task.frequency}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${task.nextDue === 'Today' ? 'text-red-600' : 'text-slate-700'}`}>{task.nextDue}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center"><User size={12}/></div>
                        {task.tech}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}