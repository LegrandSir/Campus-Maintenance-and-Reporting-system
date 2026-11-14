// frontend/src/pages/Inventory.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Package, AlertTriangle, Wallet, Filter, Plus, CheckCircle2, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Inventory() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Admin', role: 'Admin' });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [inventoryItems, setInventoryItems] = useState([
    { id: 'INV-101', name: 'Standard AC Filters', category: 'HVAC', stock: 12, min: 15, unit: 'pcs', price: 1850 },
    { id: 'INV-102', name: 'Fluorescent LED Tubes (4ft)', category: 'Electrical', stock: 45, min: 20, unit: 'pcs', price: 650 },
    { id: 'INV-103', name: 'PPR Water Pipe (2-inch)', category: 'Plumbing', stock: 8, min: 10, unit: 'meters', price: 1200 },
    { id: 'INV-104', name: 'Heavy-Duty Door Locks (Silver)', category: 'Hardware', stock: 24, min: 10, unit: 'pcs', price: 3200 },
    { id: 'INV-105', name: 'Ethernet Cables (Cat6 Pure Copper)', category: 'IT/Network', stock: 150, min: 50, unit: 'meters', price: 120 },
  ]);

  const [newItem, setNewItem] = useState({ name: '', category: 'Electrical', stock: 20, min: 10, unit: 'pcs', price: 1000 });

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return navigate('/login');
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Live Restock Action for Demo
  const handleRestock = (id, name) => {
    setInventoryItems(prev => prev.map(item => 
      item.id === id ? { ...item, stock: item.stock + 15 } : item
    ));
    triggerToast(`Restock order placed: +15 units added to ${name}`);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const nextId = `INV-${101 + inventoryItems.length}`;
    setInventoryItems(prev => [
      ...prev,
      { ...newItem, id: nextId, stock: Number(newItem.stock), min: Number(newItem.min), price: Number(newItem.price) }
    ]);
    setShowModal(false);
    setNewItem({ name: '', category: 'Electrical', stock: 20, min: 10, unit: 'pcs', price: 1000 });
    triggerToast(`${newItem.name} added to campus inventory`);
  };

  const categories = ['All', 'HVAC', 'Electrical', 'Plumbing', 'Hardware', 'IT/Network'];
  const cycleCategory = () => {
    const nextIdx = (categories.indexOf(categoryFilter) + 1) % categories.length;
    setCategoryFilter(categories[nextIdx]);
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Dynamic KPI Calculations in KSh
  const totalUnits = inventoryItems.reduce((sum, i) => sum + i.stock, 0);
  const lowStockCount = inventoryItems.filter(i => i.stock < i.min).length;
  const totalValueKsh = inventoryItems.reduce((sum, i) => sum + (i.stock * i.price), 0);

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
              placeholder="Search spare parts or #INV ID..." 
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
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">Inventory Management</h1>
              <p className="text-slate-500">Track spare parts, tools, and maintenance supplies across campus stores.</p>
            </div>
            <div className="flex items-center gap-3">
              {toastMsg && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
                  <CheckCircle2 size={16} /> {toastMsg}
                </div>
              )}
              <button 
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus size={16} /> Add New Item
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Package size={24} /></div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Total Units in Stock</p>
                <h3 className="text-2xl font-bold text-slate-900">{totalUnits}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-red-200 flex items-center gap-4 shadow-sm shadow-red-50 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><AlertTriangle size={24} /></div>
              <div>
                <p className="text-sm font-semibold text-red-500">Low Stock Alerts</p>
                <h3 className="text-2xl font-bold text-red-700">{lowStockCount} {lowStockCount === 1 ? 'Item' : 'Items'}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><Wallet size={24} /></div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Inventory Valuation</p>
                <h3 className="text-2xl font-bold text-slate-900">KSh {totalValueKsh.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-slate-900">Stock Levels</h3>
                {categoryFilter !== 'All' && (
                  <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full">
                    Category: {categoryFilter}
                  </span>
                )}
              </div>
              <button 
                onClick={cycleCategory}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Filter size={16} /> Filter ({categoryFilter})
              </button>
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
                {filteredItems.map((item) => {
                  const isLow = item.stock < item.min;
                  const stockPercent = Math.min((item.stock / (item.min * 3)) * 100, 100);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          {item.id} • KSh {item.price.toLocaleString()}/{item.unit}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.category}</td>
                      <td className="px-6 py-4 w-56">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-700">{item.stock} {item.unit}</span>
                          <span className="text-slate-400">Min: {item.min}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-500 ${isLow ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${stockPercent}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {isLow ? 'Restock Needed' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleRestock(item.id, item.name)}
                          className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors"
                        >
                          + Order Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Inventory Item Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-md shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Add New Spare Part</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Item Name</label>
                  <input type="text" required value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="e.g. Circuit Breaker 32A" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Category</label>
                    <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                      <option>Electrical</option>
                      <option>HVAC</option>
                      <option>Plumbing</option>
                      <option>Hardware</option>
                      <option>IT/Network</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Unit Price (KSh)</label>
                    <input type="number" required value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Initial Stock</label>
                    <input type="number" required value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Min Threshold</label>
                    <input type="number" required value={newItem.min} onChange={e => setNewItem({...newItem, min: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Save Item</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}