// frontend/src/pages/TicketDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
  ArrowLeft, Search, Bell, Clock, AlertTriangle, Image as ImageIcon, 
  Paperclip, Send, Star, ShieldAlert, CheckCircle, MoreVertical
} from 'lucide-react';
import api from '../services/api';

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState({ name: 'Paul Wafula', role: 'Student' });
  
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    api.get(`/tickets/${id}`)
       .then(res => setTicket(res.data))
       .catch(err => console.error("Failed to load ticket", err));
  }, [id]);

  const handleResolve = async () => {
    try {
      await api.patch(`/tickets/${id}/resolve`);
      setTicket(prev => ({ ...prev, status: 'Resolved' }));
    } catch (err) {
      console.error("Failed to resolve ticket", err);
    }
  };

  const handleEscalate = async () => {
    try {
      await api.patch(`/tickets/${id}/escalate`);
      setTicket(prev => ({ ...prev, priority: 'Urgent Priority' }));
    } catch (err) {
      console.error("Failed to escalate ticket", err);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;
    try {
      await api.post(`/tickets/${id}/feedback`, { feedback });
      setFeedbackSubmitted(true);
      setFeedback('');
    } catch (err) {
      console.error("Failed to submit feedback", err);
    }
  };

  const handleCancel = async () => {
    try {
      await api.patch(`/tickets/${id}/status`, { status: 'Cancelled' });
      setTicket(prev => ({ ...prev, status: 'Cancelled' }));
    } catch (err) {
      console.error("Failed to cancel ticket", err);
    }
  };

  if (!ticket) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">Loading...</div>;

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search tickets, rooms, or staff..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
          <div className="max-w-6xl mx-auto">
            {/* Ticket Header */}
            <div className="mb-6 flex justify-between items-start">
              <div>
                <button onClick={() => navigate('/dashboard')} className="text-xs font-semibold text-slate-500 hover:text-blue-600 uppercase tracking-wider flex items-center gap-1 mb-3">
                  <ArrowLeft size={14} /> Back to Dashboard <span className="text-slate-300 mx-1">&gt;</span> TK-{ticket.id}
                </button>
                <h1 className="text-3xl font-semibold text-slate-900 mb-3">{ticket.title}</h1>
                <div className="flex items-center gap-3 text-xs font-medium">
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full"><Clock size={14} /> {ticket.status}</span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">General</span>
                  <span className={`px-2.5 py-1 rounded-full flex items-center gap-1 ${ticket.priority.includes('Urgent') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    <AlertTriangle size={14} /> {ticket.priority}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1"><Clock size={14} /> Reported {new Date(ticket.reported_date || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-3">
                {/* 1. Escalate is visible to everyone */}
                <button 
                  onClick={handleEscalate}
                  disabled={ticket.priority.includes('Urgent') || ticket.status === 'Resolved' || ticket.status === 'Cancelled'}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                    ticket.priority.includes('Urgent') || ticket.status === 'Resolved' || ticket.status === 'Cancelled'
                      ? 'bg-slate-50 border border-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
                  }`}
                >
                  <AlertTriangle size={16} /> {ticket.priority.includes('Urgent') ? 'Escalated' : 'Escalate Issue'}
                </button>

                {/* 2. ONLY Students can Cancel, and ONLY if it's still Open */}
                {user.role === 'Student' && ticket.status === 'Open' && (
                  <button 
                    onClick={handleCancel} 
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    Cancel Request
                  </button>
                )}

                {/* 3. ONLY Staff and Admins can Mark as Resolved */}
                {(user.role === 'Staff' || user.role === 'Admin') && (
                  <button 
                    onClick={handleResolve} 
                    disabled={ticket.status === 'Resolved'}
                    className={`px-4 py-2 text-white rounded-lg font-medium flex items-center gap-2 transition-colors ${
                      ticket.status === 'Resolved' 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : 'bg-[#3B5998] hover:bg-blue-700'
                    }`}
                  >
                    {ticket.status === 'Resolved' ? 'Resolved' : 'Mark as Resolved'}
                  </button>
                )}
                
                <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Left & Middle Column */}
              <div className="col-span-2 space-y-6">
                {/* Overview Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 flex gap-6">
                  <div className="w-1/3 bg-slate-100 rounded-lg h-48 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 relative overflow-hidden">
                    <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">Reported Photo</span>
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-xs">No image attached</span>
                  </div>
                  <div className="w-2/3">
                    <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">Issue Overview</h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">{ticket.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                        <p className="text-slate-800 font-medium">{ticket.location}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Reported By</p>
                        <div className="text-slate-800 font-medium flex items-center gap-2">
                          <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-[10px]">{user.name.charAt(0)}</div>
                          {user.name} <span className="text-slate-400">({user.role})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Progression */}
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-slate-900">Tracking Progression</h3>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded">LIVE STATUS</span>
                  </div>
                  
                  {/* Dynamic Timeline border color changes if resolved */}
                  <div className={`relative border-l-2 ml-3 space-y-8 pb-4 ${ticket.status === 'Resolved' ? 'border-green-500' : ticket.status === 'In Progress' ? 'border-blue-500' : 'border-slate-200'}`}>
                    
                    {/* 1. Issue Reported (Always Green/Done) */}
                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <CheckCircle size={10} className="text-white absolute" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        Issue Reported <span className="text-xs font-normal text-slate-400 ml-2">{new Date(ticket.reported_date || Date.now()).toLocaleDateString()}</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">Ticket #TK-{ticket.id} created and categorized.</p>
                    </div>

                    {/* 2. In Progress (Lights up Blue when In Progress or beyond) */}
                    <div className={`relative pl-6 ${ticket.status === 'Open' ? 'opacity-40' : ''}`}>
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white flex items-center justify-center ${ticket.status !== 'Open' ? 'bg-blue-500' : 'bg-slate-200'}`}>
                        {ticket.status === 'Resolved' && <CheckCircle size={10} className="text-white absolute" />}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">In Progress</h4>
                      <p className="text-xs text-slate-500 mt-1">Facility team has been notified and is assessing the report.</p>
                    </div>

                    {/* 3. Resolved (Lights up Green ONLY when Resolved) */}
                    <div className={`relative pl-6 ${ticket.status !== 'Resolved' ? 'opacity-40' : ''}`}>
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white flex items-center justify-center ${ticket.status === 'Resolved' ? 'bg-green-500' : 'bg-slate-200'}`}>
                        {ticket.status === 'Resolved' && <CheckCircle size={10} className="text-white absolute" />}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">Ticket Resolved</h4>
                      <p className="text-xs text-slate-500 mt-1">System closure and feedback requested.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Chat Panel */}
                <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-[400px]">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">FD</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 leading-none">Facility Desk</p>
                        <p className="text-xs text-slate-500 mt-1">Support Team</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-4 bg-slate-50 overflow-y-auto">
                    <p className="text-xs text-center text-slate-400 mb-4">Ticket created</p>
                  </div>
                  <div className="p-4 bg-white border-t border-slate-100">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5">
                      <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent text-sm px-2 focus:outline-none" />
                      <button className="p-1.5 text-slate-400 hover:text-slate-600"><Paperclip size={16} /></button>
                      <button className="p-1.5 bg-[#3B5998] text-white rounded-md hover:bg-blue-700"><Send size={16} /></button>
                    </div>
                  </div>
                </div>

                {/* Feedback Panel */}
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <Star size={16} className="text-slate-400" /> Share Your Feedback
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">Help us improve the campus maintenance experience.</p>
                  <textarea 
                    rows="3" 
                    placeholder={ticket.status !== 'Resolved' ? "You can leave feedback once the issue is resolved." : "Tell us what you think..."} 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    disabled={feedbackSubmitted || ticket.status !== 'Resolved'}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" 
                  ></textarea>
                  <button 
                    onClick={handleSubmitFeedback}
                    disabled={!feedback.trim() || feedbackSubmitted || ticket.status !== 'Resolved'}
                    className={`w-full font-medium py-2.5 rounded-lg text-sm transition-colors ${
                      !feedback.trim() || feedbackSubmitted || ticket.status !== 'Resolved'
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-[#3B5998] hover:bg-blue-700 text-white'
                    }`}
                  >
                    {feedbackSubmitted ? 'Feedback Received!' : 'Submit Feedback'}
                  </button>
                </div>

                {/* Emergency Protocol */}
                <div className="bg-[#0B1739] p-6 rounded-xl text-white border-l-4 border-red-500">
                  <h3 className="font-semibold mb-2 flex items-center gap-2"><ShieldAlert size={18} className="text-red-400" /> Emergency Protocol</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">If this issue poses an immediate electrical risk or property damage, please contact Campus Security at extension 911-F.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}