import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search, Bell, Clock, CheckCircle2, AlertCircle, Plus, Filter } from 'lucide-react';
import api from '../services/api';

export default function MyTickets() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Student', role: 'Student' });
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return navigate('/login');
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    api.get('/tickets').then(res => {
      // STRICT FILTER: Only keep tickets where the creator's ID matches the logged-in user's ID.
      // This guarantees you ONLY see tickets you personally submitted.
      const mySubmittedTickets = res.data.filter(ticket => ticket.user_id === parsedUser.id);
      
      setTickets(mySubmittedTickets);
    }).catch(console.error);
  }, [navigate]);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search my reports..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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

        <div className="flex-1 overflow-auto p-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">My Tickets</h1>
              <p className="text-slate-500">Track the status of maintenance issues you have reported.</p>
            </div>
            <button onClick={() => navigate('/report')} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
              <Plus size={16} /> Report New Issue
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Recent Reports</h3>
              <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg"><Filter size={16} /> Filter</button>
            </div>
            
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-slate-500">You haven't reported any issues yet.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-xs uppercase text-slate-500">
                    <th className="px-6 py-4 font-semibold">Ticket Details</th>
                    <th className="px-6 py-4 font-semibold">Location</th>
                    <th className="px-6 py-4 font-semibold">Reported Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {tickets.map(ticket => (
                    <tr key={ticket.id} onClick={() => navigate(`/ticket/${ticket.id}`)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{ticket.title}</p>
                        <p className="text-xs text-slate-500">ID: CF-{ticket.id} • {ticket.priority}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{ticket.location}</td>
                      <td className="px-6 py-4 text-slate-600">{new Date(ticket.reported_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max ${
                          ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                          ticket.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {ticket.status === 'Resolved' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}