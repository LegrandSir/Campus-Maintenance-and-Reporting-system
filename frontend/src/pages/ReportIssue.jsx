// frontend/src/pages/ReportIssue.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Zap, Droplets, Wind, Wrench, Hammer, Camera, Wifi } from 'lucide-react';
import api from '../services/api';


export default function ReportIssue() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    building: '',
    specificLocation: '',
    description: '',
    priority: 'Medium',
    category: 'General Repair'
  });

  const categories = [
    { name: 'Electrical', icon: <Zap size={24} /> },
    { name: 'Plumbing', icon: <Droplets size={24} /> },
    { name: 'HVAC', icon: <Wind size={24} /> },
    { name: 'Structural', icon: <Hammer size={24} /> },
    { name: 'IT & Network', icon: <Wifi size={24} /> },
    { name: 'General Repair', icon: <Wrench size={24} /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Combine building and specific location to match our database model
      const payload = {
        title: formData.title,
        description: formData.description,
        location: `${formData.building} - ${formData.specificLocation}`,
        priority: formData.priority,
      };
      await api.post('/tickets', payload);
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (error) {
      console.error("Failed to submit ticket", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">Report Maintenance Issue</h1>
            <p className="text-slate-500">Please provide detailed information about the facility problem to help us resolve it quickly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl border border-slate-200">
            {/* 1. Issue Classification */}
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><span className="text-blue-600 bg-blue-50 px-2 rounded">1</span> Issue Classification</h2>
              <div className="grid grid-cols-5 gap-4">
                {categories.map((cat) => (
                  <button type="button" key={cat.name} onClick={() => setFormData({...formData, category: cat.name})} className={`flex flex-col items-center justify-center p-4 rounded-xl border ${formData.category === cat.name ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    {cat.icon}
                    <span className="text-xs font-semibold mt-2 uppercase tracking-wide">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 2. Details & Location */}
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><span className="text-blue-600 bg-blue-50 px-2 rounded">2</span> Details & Location</h2>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Issue Summary</label>
                  <input type="text" required placeholder="e.g., Leaking ceiling in room 302" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Building / Facility</label>
                  <select required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700" value={formData.building} onChange={e => setFormData({...formData, building: e.target.value})}>
                    <option value="">Select a building</option>
                    <option value="Freida Brown Student Center">Freida Brown Student Center</option>
                    <option value="Lillian K. Beam Building">Lillian K. Beam Building</option>
                    <option value="Chandaria School of Business">Chandaria School of Business</option>
                    <option value="Science Center">Science Center</option>
                    <option value="Library">Library</option>
                    <option value="Hostels / Dormitories">Hostels / Dormitories</option>
                    <option value="Cafeteria">Cafeteria</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Specific Location</label>
                <input type="text" required placeholder="e.g., 3rd Floor, West Wing, Room 314 near the window" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" value={formData.specificLocation} onChange={e => setFormData({...formData, specificLocation: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Detailed Description</label>
                <textarea required rows="4" placeholder="Describe the problem in detail..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Urgency Level</label>
                <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1">
                  {['Low', 'Medium', 'High', 'Urgent'].map(level => (
                    <button type="button" key={level} onClick={() => setFormData({...formData, priority: `${level} Priority`})} className={`flex-1 py-2 text-sm font-medium rounded-md ${formData.priority.includes(level) ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />
            
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-3 font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
              <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">Submit Report &rarr;</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}