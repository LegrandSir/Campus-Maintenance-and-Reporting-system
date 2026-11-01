// frontend/src/pages/MyTickets.jsx
import Sidebar from '../components/Sidebar';
import { FileText } from 'lucide-react';

export default function MyTickets() {
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8 flex flex-col items-center justify-center text-slate-500">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
          <FileText size={32} />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-slate-900">My Tickets</h1>
        <p>Dedicated list view with advanced filtering is being built here.</p>
      </main>
    </div>
  );
}