import { useState } from 'react';
import { Search, Bell, Plus, Filter, QrCode, MapPin, Activity, PenTool, Monitor } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Assets() {
  const [searchTerm, setSearchTerm] = useState('');

  const assets = [
    { id: 'AST-501', name: 'Main Library HVAC Unit', category: 'Infrastructure', location: 'Library - Roof', condition: 'Good', lastService: 'Oct 15, 2026' },
    { id: 'AST-502', name: 'Lab 4 Smart Projector', category: 'Electronics', location: 'Lilian Beam - Ground', condition: 'Needs Service', lastService: 'Jan 10, 2026' },
    { id: 'AST-503', name: 'Backup Generator B', category: 'Power', location: 'South Quad Utility', condition: 'Critical', lastService: 'Aug 22, 2025' },
    { id: 'AST-504', name: 'Elevator Car #2', category: 'Transport', location: 'Freida Brown', condition: 'Good', lastService: 'Oct 28, 2026' },
    { id: 'AST-505', name: 'Water Pump Station 1', category: 'Plumbing', location: 'Hostels Wing', condition: 'Needs Service', lastService: 'Mar 05, 2026' },
    { id: 'AST-506', name: 'Auditorium PA System', category: 'Electronics', location: 'Main Auditorium', condition: 'Good', lastService: 'Sep 12, 2026' },
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
              placeholder="Search assets by name or ID..." 
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
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">Asset Management</h1>
              <p className="text-slate-500">Track equipment identity, location, and condition history.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 flex items-center gap-2">
                <Filter size={16} /> Filters
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
                <Plus size={16} /> Register Asset
              </button>
            </div>
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                      {asset.category === 'Electronics' ? <Monitor size={20} /> : <Activity size={20} />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{asset.name}</h3>
                      <p className="text-xs text-slate-500">{asset.id} • {asset.category}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-blue-600"><QrCode size={20} /></button>
                </div>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={16} className="text-slate-400" /> {asset.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <PenTool size={16} className="text-slate-400" /> Last Serviced: {asset.lastService}
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
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800">View History &rarr;</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}