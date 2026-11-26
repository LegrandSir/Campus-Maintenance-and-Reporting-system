// frontend/src/pages/Help.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search, Bell, PhoneCall, Mail, MapPin, HelpCircle, ShieldAlert, BookOpen } from 'lucide-react';

export default function Help() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'User', role: 'Student' });

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return navigate('/login');
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const faqs = [
    {
      q: "How quickly are Urgent Priority tickets addressed?",
      a: "Urgent tickets (such as burst pipes, live electrical faults, or security lockouts) are immediately flagged on the Supervisor Kanban Board with a 2-hour target SLA response time."
    },
    {
      q: "How do I know who is assigned to fix my reported issue?",
      a: "Once the Facility Supervisor reviews your ticket and moves it to the 'Assigned' stage, the assigned technician's name appears directly on the ticket card and in your Ticket Details view."
    },
    {
      q: "Can I update or cancel a ticket after submitting it?",
      a: "Students can view live progress under 'My Tickets'. If an issue was resolved on its own or entered by mistake, click into the ticket details to leave a note for the maintenance desk."
    },
    {
      q: "What is the difference between Staff and Admin accounts?",
      a: "Admins oversee campus-wide infrastructure, manage inventory/assets, and dispatch technicians. Staff members view their assigned work orders on the Kanban board and update repair statuses in real time."
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search documentation and FAQs..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Help & Support Center</h1>
            <p className="text-slate-500 text-sm">Guides, SLA response policies, and direct campus facility emergency contacts.</p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0"><ShieldAlert size={24} /></div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Emergency Dispatch</h3>
                <p className="text-xs text-slate-500 mb-2">For active flooding, fire hazards, or power outages.</p>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><PhoneCall size={14} className="text-red-500"/> +254 730 116 000 (Ext. 999)</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Mail size={24} /></div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Facilities Helpdesk</h3>
                <p className="text-xs text-slate-500 mb-2">General inquiries, event setups, and vendor support.</p>
                <p className="text-sm font-bold text-blue-600">facilities-support@campusfix.ac.ke</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0"><MapPin size={24} /></div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Operations Office</h3>
                <p className="text-xs text-slate-500 mb-2">Walk-in maintenance desk hours: Mon–Fri, 8AM–5PM.</p>
                <p className="text-sm font-semibold text-slate-800">Central Administration Block, Ground Floor</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <BookOpen className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200/60">
                  <h4 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                    <HelpCircle size={16} className="text-blue-500 shrink-0" />
                    {faq.q}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}