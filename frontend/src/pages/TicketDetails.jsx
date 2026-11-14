// frontend/src/pages/TicketDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
  ArrowLeft, Search, Bell, Clock, AlertTriangle, Image as ImageIcon, 
  Paperclip, Send, Star, ShieldAlert, CheckCircle, MoreVertical, 
  UserCheck, Maximize2, X
} from 'lucide-react';
import api from '../services/api';

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState({ name: 'Paul Wafula', role: 'Student' });
  
  // Interactive Feedback & Rating state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Interactive Chat & Image Modal state
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Facility Desk',
      role: 'Support Team',
      text: 'Ticket logged in the CampusFix queue. A technician will be dispatched based on SLA priority.',
      time: 'Just now',
      isSelf: false
    }
  ]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    // FIXED: Use sessionStorage so multi-tab roles stay isolated
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return navigate('/login');
    setUser(JSON.parse(storedUser));

    api.get(`/tickets/${id}`)
       .then(res => setTicket(res.data))
       .catch(err => console.error("Failed to load ticket", err));
  }, [id, navigate]);

  const handleResolve = async () => {
    try {
      await api.patch(`/tickets/${id}/resolve`);
      setTicket(prev => ({ ...prev, status: 'Resolved', resolved_date: new Date().toISOString() }));
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
    if (!feedback.trim() && rating === 0) return;
    try {
      await api.post(`/tickets/${id}/feedback`, { feedback, rating });
      setFeedbackSubmitted(true);
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: user.name,
      role: user.role,
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };
    setMessages(prev => [...prev, newMsg]);
    setMessageInput('');
  };

  if (!ticket) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC] text-slate-500 font-medium">
        Loading ticket details...
      </div>
    );
  }

  const userInitials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tickets, rooms, or staff..." 
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

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Ticket Header */}
            <div className="mb-6 flex justify-between items-start">
              <div>
                <button 
                  onClick={() => navigate(-1)} 
                  className="text-xs font-semibold text-slate-500 hover:text-blue-600 uppercase tracking-wider flex items-center gap-1 mb-3 transition-colors"
                >
                  <ArrowLeft size={14} /> Back <span className="text-slate-300 mx-1">&gt;</span> CF-{ticket.id}
                </button>
                <h1 className="text-3xl font-semibold text-slate-900 mb-3">{ticket.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                    ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                    ticket.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                    ticket.status === 'Assigned' ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    <Clock size={14} /> {ticket.status}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    ticket.priority?.includes('Urgent') ? 'bg-red-100 text-red-700' : 
                    ticket.priority?.includes('High') ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    <AlertTriangle size={14} /> {ticket.priority}
                  </span>
                  {ticket.assigned_to && (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                      <UserCheck size={14} /> Assigned: {ticket.assigned_to}
                    </span>
                  )}
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock size={14} /> Reported {new Date(ticket.reported_date || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                {/* 1. Escalate is visible to everyone */}
                <button 
                  onClick={handleEscalate}
                  disabled={ticket.priority?.includes('Urgent') || ticket.status === 'Resolved' || ticket.status === 'Cancelled'}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    ticket.priority?.includes('Urgent') || ticket.status === 'Resolved' || ticket.status === 'Cancelled'
                      ? 'bg-slate-50 border border-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-white border border-red-200 text-red-600 hover:bg-red-50 active:scale-[0.98]'
                  }`}
                >
                  <AlertTriangle size={16} /> {ticket.priority?.includes('Urgent') ? 'Escalated' : 'Escalate Issue'}
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

                {/* 3. Staff, Maintenance, and Admins can Mark as Resolved */}
                {(user.role === 'Staff' || user.role === 'Maintenance' || user.role === 'Admin') && (
                  <button 
                    onClick={handleResolve} 
                    disabled={ticket.status === 'Resolved'}
                    className={`px-4 py-2 text-white rounded-lg font-medium flex items-center gap-2 transition-all ${
                      ticket.status === 'Resolved' 
                        ? 'bg-emerald-600 cursor-not-allowed' 
                        : 'bg-[#3B5998] hover:bg-blue-700 active:scale-[0.98]'
                    }`}
                  >
                    <CheckCircle size={16} />
                    {ticket.status === 'Resolved' ? 'Resolved' : 'Mark as Resolved'}
                  </button>
                )}
                
                <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Left & Middle Column */}
              <div className="col-span-2 space-y-6">
                {/* Overview Card with Live Photo Display */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 flex gap-6">
                  {ticket.image_url ? (
                    <div 
                      onClick={() => setIsImageModalOpen(true)}
                      className="w-1/3 bg-slate-900 rounded-lg h-48 relative overflow-hidden group cursor-pointer border border-slate-200 shrink-0"
                    >
                      <img 
                        src={ticket.image_url} 
                        alt={ticket.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded">
                        Attached Photo
                      </span>
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1">
                        <Maximize2 size={16} /> Click to enlarge
                      </div>
                    </div>
                  ) : (
                    <div className="w-1/3 bg-slate-100 rounded-lg h-48 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 relative overflow-hidden shrink-0">
                      <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">Reported Photo</span>
                      <ImageIcon size={32} className="mb-2 opacity-50" />
                      <span className="text-xs">No image attached</span>
                    </div>
                  )}

                  <div className="w-2/3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">Issue Overview</h3>
                      <p className="text-sm text-slate-600 mb-6 leading-relaxed">{ticket.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                        <p className="text-slate-800 font-medium">{ticket.location}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Assigned Technician</p>
                        <div className="text-slate-800 font-medium flex items-center gap-2">
                          <div className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[10px] font-bold">
                            {(ticket.assigned_to || 'U')[0]}
                          </div>
                          {ticket.assigned_to || 'Awaiting Dispatch'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Progression */}
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-slate-900">Tracking Progression</h3>
                    <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                      LIVE STATUS
                    </span>
                  </div>
                  
                  <div className={`relative border-l-2 ml-3 space-y-8 pb-4 transition-colors duration-500 ${
                    ticket.status === 'Resolved' ? 'border-green-500' : 
                    (ticket.status === 'In Progress' || ticket.status === 'Assigned') ? 'border-blue-500' : 'border-slate-200'
                  }`}>
                    {/* 1. Issue Reported */}
                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <CheckCircle size={10} className="text-white absolute" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        Issue Reported <span className="text-xs font-normal text-slate-400 ml-2">{new Date(ticket.reported_date || Date.now()).toLocaleDateString()}</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">Ticket #CF-{ticket.id} logged and routed to Campus Facility Desk.</p>
                    </div>

                    {/* 2. Assigned & In Progress */}
                    <div className={`relative pl-6 transition-opacity ${ticket.status === 'Open' ? 'opacity-40' : ''}`}>
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white flex items-center justify-center ${
                        ticket.status !== 'Open' ? 'bg-blue-500' : 'bg-slate-200'
                      }`}>
                        {ticket.status === 'Resolved' && <CheckCircle size={10} className="text-white absolute" />}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {ticket.status === 'Assigned' ? 'Assigned to Technician' : 'In Progress'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {ticket.assigned_to 
                          ? `Assigned to ${ticket.assigned_to} for on-site inspection and repair.` 
                          : 'Facility team has been notified and is assessing the report.'}
                      </p>
                    </div>

                    {/* 3. Resolved */}
                    <div className={`relative pl-6 transition-opacity ${ticket.status !== 'Resolved' ? 'opacity-40' : ''}`}>
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white flex items-center justify-center ${
                        ticket.status === 'Resolved' ? 'bg-green-500' : 'bg-slate-200'
                      }`}>
                        {ticket.status === 'Resolved' && <CheckCircle size={10} className="text-white absolute" />}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">Ticket Resolved</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {ticket.status === 'Resolved' 
                          ? 'Repair verified complete. Student quality rating unlocked.' 
                          : 'Awaiting technician sign-off and student feedback.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Interactive Chat Panel */}
                <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-[380px]">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">FD</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 leading-none">Facility Desk Updates</p>
                        <p className="text-xs text-slate-500 mt-1">{ticket.assigned_to ? `Tech: ${ticket.assigned_to}` : 'Support Team'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-3">
                    <p className="text-[11px] text-center text-slate-400 uppercase tracking-wider">Ticket Activity Stream</p>
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                          msg.isSelf ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                        }`}>
                          <p className={`font-semibold text-[10px] mb-0.5 ${msg.isSelf ? 'text-blue-100' : 'text-blue-600'}`}>
                            {msg.sender} ({msg.role})
                          </p>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5">
                      <input 
                        type="text" 
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Add a comment or update..." 
                        className="flex-1 bg-transparent text-sm px-2 focus:outline-none" 
                      />
                      <button type="submit" className="p-1.5 bg-[#3B5998] text-white rounded-md hover:bg-blue-700 transition-colors">
                        <Send size={15} />
                      </button>
                    </div>
                  </form>
                </div>

                {/* Feedback Panel with Interactive 5-Star Rating */}
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <Star size={16} className="text-amber-400 fill-amber-400" /> Rate Repair Quality
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">Help us evaluate response speed and maintenance quality.</p>
                  
                  {/* 5-Star Selector */}
                  <div className="flex items-center gap-1.5 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        disabled={feedbackSubmitted || ticket.status !== 'Resolved'}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 disabled:cursor-not-allowed transition-transform hover:scale-110"
                      >
                        <Star 
                          size={22} 
                          className={`${
                            star <= (hoverRating || rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="text-xs font-semibold text-amber-600 ml-2">{rating}/5 Stars</span>
                    )}
                  </div>

                  <textarea 
                    rows="3" 
                    placeholder={ticket.status !== 'Resolved' ? "Feedback unlocks once the ticket is marked Resolved." : "Share any comments about the repair..."} 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    disabled={feedbackSubmitted || ticket.status !== 'Resolved'}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" 
                  ></textarea>
                  <button 
                    onClick={handleSubmitFeedback}
                    disabled={(!feedback.trim() && rating === 0) || feedbackSubmitted || ticket.status !== 'Resolved'}
                    className={`w-full font-medium py-2.5 rounded-lg text-sm transition-all ${
                      (!feedback.trim() && rating === 0) || feedbackSubmitted || ticket.status !== 'Resolved'
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-[#3B5998] hover:bg-blue-700 text-white active:scale-[0.98]'
                    }`}
                  >
                    {feedbackSubmitted ? '★ Thank You for Your Feedback!' : 'Submit Review'}
                  </button>
                </div>

                {/* Emergency Protocol */}
                <div className="bg-[#0B1739] p-6 rounded-xl text-white border-l-4 border-red-500">
                  <h3 className="font-semibold mb-2 flex items-center gap-2"><ShieldAlert size={18} className="text-red-400" /> Emergency Protocol</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">If this issue poses an immediate electrical risk or flooding hazard, contact Campus Security at Ext. 999.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Image Lightbox Modal */}
        {isImageModalOpen && ticket.image_url && (
          <div 
            onClick={() => setIsImageModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          >
            <div className="relative max-w-4xl max-h-full">
              <button 
                onClick={() => setIsImageModalOpen(false)}
                className="absolute -top-10 right-0 text-white hover:text-red-400 flex items-center gap-1 text-sm font-medium"
              >
                <X size={20} /> Close Preview
              </button>
              <img 
                src={ticket.image_url} 
                alt={ticket.title} 
                className="max-h-[85vh] w-auto rounded-xl border border-white/20 shadow-2xl" 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}