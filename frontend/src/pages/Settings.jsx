// frontend/src/pages/Settings.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
  Search, Bell, Shield, Users, Clock, Mail, Plus, Trash2, CheckCircle2, Save 
} from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Admin', role: 'Admin' });
  const [activeTab, setActiveTab] = useState('staff');
  const [savedToast, setSavedToast] = useState(false);

  const [staffList, setStaffList] = useState([
    { id: 1, name: 'John Kamau', email: 'jkamau@campusfix.ac.ke', specialty: 'Plumbing & Water', role: 'Staff', status: 'Active' },
    { id: 2, name: 'Sarah Ochieng', email: 'sochieng@campusfix.ac.ke', specialty: 'Electrical & HVAC', role: 'Staff', status: 'Active' },
    { id: 3, name: 'David Mwangi', email: 'dmwangi@campusfix.ac.ke', specialty: 'IT & Projectors', role: 'Staff', status: 'On Leave' },
    { id: 4, name: 'Grace Wanjiku', email: 'gwanjiku@campusfix.ac.ke', specialty: 'Carpentry & Structural', role: 'Staff', status: 'Active' },
  ]);

  const [newStaff, setNewStaff] = useState({ name: '', email: '', specialty: 'Electrical & HVAC', role: 'Staff' });

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return navigate('/login');
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;
    setStaffList([...staffList, { ...newStaff, id: Date.now(), status: 'Active' }]);
    setNewStaff({ name: '', email: '', specialty: 'Electrical & HVAC', role: 'Staff' });
    showToast();
  };

  const handleRemoveStaff = (id) => {
    setStaffList(staffList.filter(s => s.id !== id));
  };

  const showToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search settings or users..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">System Settings & Access Control</h1>
              <p className="text-slate-500 text-sm">Manage maintenance personnel, RBAC permissions, and SLA response thresholds.</p>
            </div>
            {savedToast && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                <CheckCircle2 size={16} /> Changes saved successfully
              </div>
            )}
          </div>

          <div className="flex gap-2 border-b border-slate-200 mb-6">
            <button onClick={() => setActiveTab('staff')} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'staff' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
              <Users size={16} /> Staff & Role Management
            </button>
            <button onClick={() => setActiveTab('sla')} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'sla' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
              <Clock size={16} /> SLA & Priority Rules
            </button>
            <button onClick={() => setActiveTab('notifications')} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'notifications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
              <Mail size={16} /> Notifications & Alerts
            </button>
          </div>

          {activeTab === 'staff' && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900">Registered Facility Personnel</h3>
                  <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full">{staffList.length} Active Accounts</span>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-xs uppercase text-slate-500">
                      <th className="px-6 py-3.5 font-semibold">Name & Email</th>
                      <th className="px-6 py-3.5 font-semibold">Department / Specialty</th>
                      <th className="px-6 py-3.5 font-semibold">Role</th>
                      <th className="px-6 py-3.5 font-semibold">Status</th>
                      <th className="px-6 py-3.5 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {staffList.map(member => (
                      <tr key={member.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{member.specialty}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">{member.role}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleRemoveStaff(member.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 h-max">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="text-blue-600" size={20} />
                  <h3 className="font-semibold text-slate-900">Provision New Account</h3>
                </div>
                <p className="text-xs text-slate-500 mb-5">Add a technician or supervisor to enable Kanban ticket assignments.</p>
                <form onSubmit={handleAddStaff} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
                    <input type="text" required value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} placeholder="e.g. Peter Njoroge" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">University Email</label>
                    <input type="email" required value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} placeholder="pnjoroge@campusfix.ac.ke" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Specialty Unit</label>
                    <select value={newStaff.specialty} onChange={e => setNewStaff({...newStaff, specialty: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Electrical & HVAC</option>
                      <option>Plumbing & Water</option>
                      <option>IT & Projectors</option>
                      <option>Carpentry & Structural</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">System Role</label>
                    <select value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Staff">Staff (Technician)</option>
                      <option value="Admin">Admin (Supervisor)</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Personnel
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'sla' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl space-y-6">
              <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3">Target Resolution Timeframes (SLA)</h3>
              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <p className="text-sm font-semibold text-red-600">Urgent Priority</p>
                  <p className="text-xs text-slate-500">Major leaks, power outages, safety hazards</p>
                </div>
                <input type="text" defaultValue="2 Hours" className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                <div>
                  <p className="text-sm font-semibold text-orange-600">High Priority</p>
                  <p className="text-xs text-slate-500">Broken AC in labs, classroom AV failure</p>
                </div>
                <input type="text" defaultValue="8 Hours" className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                <div>
                  <p className="text-sm font-semibold text-yellow-600">Medium Priority</p>
                  <p className="text-xs text-slate-500">Furniture repair, minor lighting issues</p>
                </div>
                <input type="text" defaultValue="24 Hours" className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <button onClick={showToast} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                <Save size={16} /> Save SLA Rules
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl space-y-4">
              <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3">Automated Email & SMS Triggers</h3>
              {[
                { label: 'Notify student when ticket status changes to In Progress or Resolved', defaultChecked: true },
                { label: 'Alert Admin supervisor when Urgent Priority ticket is submitted', defaultChecked: true },
                { label: 'Send daily digest of unassigned tickets at 8:00 AM', defaultChecked: false },
              ].map((item, i) => (
                <label key={i} className="flex items-center justify-between py-2 cursor-pointer">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <input type="checkbox" defaultChecked={item.defaultChecked} className="w-4 h-4 text-blue-600 rounded" />
                </label>
              ))}
              <button onClick={showToast} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                <Save size={16} /> Update Preferences
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}