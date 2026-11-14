// frontend/src/pages/Assets.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, Filter, QrCode, MapPin, Activity, PenTool, Monitor, X, CheckCircle2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Assets() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Admin', role: 'Admin' });
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [assets, setAssets] = useState([
    { id: 'AST-501', name: 'Main Library HVAC Unit', category: 'Infrastructure', location: 'Library - Roof', condition: 'Good', lastService: 'Oct 15, 2026' },
    { id: 'AST-502', name: 'Lab 4 Smart Projector', category: 'Electronics', location: 'Lilian Beam - Ground', condition: 'Needs Service', lastService: 'Jan 10, 2026' },
    { id: 'AST-503', name: 'Backup Generator B (500kVA)', category: 'Power', location: 'South Quad Utility', condition: 'Critical', lastService: 'Aug 22, 2025' },
    { id: 'AST-504', name: 'Elevator Car #2', category: 'Transport', location: 'Freida Brown', condition: 'Good', lastService: 'Oct 28, 2026' },
    { id: 'AST-505', name: 'Water Pump Station 1', category: 'Plumbing', location: 'Hostels Wing', condition: 'Needs Service', lastService: 'Mar 05, 2026' },
    { id: 'AST-506', name: 'Auditorium PA System', category: 'Electronics', location: 'Main Auditorium', condition: 'Good', lastService: 'Sep 12, 2026' },
  ]);

  const [newAsset, setNewAsset] = useState({ name: '', category: 'Electronics', location: '', condition: 'Good' });

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return navigate('/login');
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const conditions = ['All', 'Good', 'Needs Service', 'Critical'];
  const cycleCondition = () => {
    const nextIdx = (conditions.indexOf(conditionFilter) + 1) % conditions.length;
    setConditionFilter(conditions[nextIdx]);
  };

  const handleMarkServiced = (id) => {
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    setAssets(prev => prev.map(a => a.id === id ? { ...a, condition: 'Good', lastService: todayStr } : a));
    setSelectedAsset(null);
  };

  const handleRegisterAsset = (e) => {
    e.preventDefault();
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const nextId = `AST-${501 + assets.length}`;
    setAssets(prev => [...prev, { ...newAsset, id: nextId, lastService: todayStr }]);
    setShowAddModal(false);
    setNewAsset({ name: '', category: 'Electronics', location: '', condition: 'Good' });
  };

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCondition = conditionFilter === 'All' || a.condition === conditionFilter;
    return matchesSearch && matchesCondition;
  });

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
              placeholder="Search assets by name, location, or #AST ID..." 
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
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">Asset Management</h1>
              <p className="text-slate-500">Track campus equipment identity, location, and maintenance history.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={cycleCondition}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Filter size={16} /> Filter: {conditionFilter}
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus size={16} /> Register Asset
              </button>
            </div>
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      {asset.category === 'Electronics' ? <Monitor size={20} /> : <Activity size={20} />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{asset.name}</h3>
                      <p className="text-xs text-slate-500">{asset.id} • {asset.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedAsset(asset)}
                    title="Inspect QR & Service Log"
                    className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    <QrCode size={20} />
                  </button>
                </div>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={16} className="text-slate-400 shrink-0" /> {asset.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <PenTool size={16} className="text-slate-400 shrink-0" /> Last Serviced: {asset.lastService}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    asset.condition === 'Good' ? 'bg-green-100 text-green-700' :
                    asset.condition === 'Needs Service' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {asset.condition}
                  </span>
                  <button 
                    onClick={() => setSelectedAsset(asset)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    View History &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Details / QR Inspection Modal */}
        {selectedAsset && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-md shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase">{selectedAsset.id}</span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedAsset.name}</h3>
                </div>
                <button onClick={() => setSelectedAsset(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4 space-y-2 text-sm">
                <p><span className="font-semibold text-slate-700">Location:</span> {selectedAsset.location}</p>
                <p><span className="font-semibold text-slate-700">Category:</span> {selectedAsset.category}</p>
                <p><span className="font-semibold text-slate-700">Last Serviced:</span> {selectedAsset.lastService}</p>
                <p><span className="font-semibold text-slate-700">Current Condition:</span> {selectedAsset.condition}</p>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setSelectedAsset(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Close</button>
                {selectedAsset.condition !== 'Good' && (
                  <button 
                    onClick={() => handleMarkServiced(selectedAsset.id)}
                    className="px-4 py-2 text-sm bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={16} /> Log Service Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Register New Asset Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-md shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Register Campus Asset</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleRegisterAsset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Asset Name</label>
                  <input type="text" required value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} placeholder="e.g. Science Block Solar Inverter" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Building & Location</label>
                  <input type="text" required value={newAsset.location} onChange={e => setNewAsset({...newAsset, location: e.target.value})} placeholder="e.g. Science Block - Basement" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Category</label>
                    <select value={newAsset.category} onChange={e => setNewAsset({...newAsset, category: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                      <option>Electronics</option>
                      <option>Infrastructure</option>
                      <option>Power</option>
                      <option>Plumbing</option>
                      <option>Transport</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Initial Condition</label>
                    <select value={newAsset.condition} onChange={e => setNewAsset({...newAsset, condition: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                      <option>Good</option>
                      <option>Needs Service</option>
                      <option>Critical</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Register Asset</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}