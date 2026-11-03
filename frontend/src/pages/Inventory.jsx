import { useState } from 'react';
import { Search, Bell, Package, AlertTriangle, DollarSign, Filter, Plus, MoreHorizontal } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const inventoryItems = [
    { id: 'INV-101', name: 'Standard AC Filters', category: 'HVAC', stock: 12, min: 15, unit: 'pcs', price: 45 },
    { id: 'INV-102', name: 'Fluorescent Bulbs (4ft)', category: 'Electrical', stock: 45, min: 20, unit: 'pcs', price: 12 },
    { id: 'INV-103', name: 'PVC Pipe (2-inch)', category: 'Plumbing', stock: 8, min: 10, unit: 'meters', price: 15 },
    { id: 'INV-104', name: 'Door Handles (Silver)', category: 'Hardware', stock: 24, min: 10, unit: 'pcs', price: 35 },
    { id: 'INV-105', name: 'Ethernet Cables (Cat6)', category: 'IT/Network', stock: 150, min: 50, unit: 'meters', price: 2 },
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
              placeholder="Search inventory..." 
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
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">Inventory Management</h1>
              <p className="text-slate-500">Track spare parts, tools, and maintenance supplies.</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
              <Plus size={16} /> Add New Item
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Package size={24} /></div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Total Items in Stock</p>
                <h3 className="text-2xl font-bold text-slate-900">239</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-red-200 flex items-center gap-4 shadow-sm shadow-red-50">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><AlertTriangle size={24} /></div>
              <div>
                <p className="text-sm font-semibold text-red-500">Low Stock Alerts</p>
                <h3 className="text-2xl font-bold text-red-700">2 Items</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><DollarSign size={24} /></div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Monthly Expenditure</p>
                <h3 className="text-2xl font-bold text-slate-900">$1,240.50</h3>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Stock Levels</h3>
              <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg"><Filter size={16} /> Filters</button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-6 py-4 font-semibold">Item Details</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Stock Level</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {inventoryItems.map((item) => {
                  const isLow = item.stock < item.min;
                  const stockPercent = Math.min((item.stock / (item.min * 3)) * 100, 100);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.id} • ${item.price}/{item.unit}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.category}</td>
                      <td className="px-6 py-4 w-48">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-700">{item.stock} {item.unit}</span>
                          <span className="text-slate-400">Min: {item.min}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${isLow ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${stockPercent}%` }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {isLow ? 'Restock Needed' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-4">Order</button>
                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={18} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}