// frontend/src/pages/ReportIssue.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
  Upload, Camera, X, CheckCircle2, AlertTriangle, MapPin, FileText, Loader2 
} from 'lucide-react';
import api from '../services/api';

export default function ReportIssue() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Student', role: 'Student' });

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Medium Priority');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Camera state & refs
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return navigate('/login');
    setUser(JSON.parse(storedUser));

    return () => stopCamera();
  }, [navigate]);

  // 1. Handle Device File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 2. Handle Live Camera Stream
  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera error:", err);
      // Fallback: trigger mobile native camera input if webcam permission fails
      fileInputRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setImagePreview(dataUrl);
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/tickets', {
        title,
        location,
        priority,
        description,
        image_url: imagePreview
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit maintenance report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <h2 className="font-semibold text-slate-800">Submit New Maintenance Request</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">
              {user.name?.[0] || 'U'}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-slate-700 leading-none">{user.name}</p>
              <p className="text-slate-500 text-xs mt-1">{user.role}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Report a Campus Facility Issue</h1>
              <p className="text-slate-500 text-sm">Provide location details and attach a photo so our technicians can bring the right tools.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Issue Summary / Title *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Broken AC Unit in Lab 4 or Water Leakage"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Building & Room Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Chandaria School of Business, Room 204"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Urgency / Priority Level *
                  </label>
                  <div className="relative">
                    <AlertTriangle className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Low Priority">Low Priority (Cosmetic / Minor)</option>
                      <option value="Medium Priority">Medium Priority (Standard Repair)</option>
                      <option value="High Priority">High Priority (Disrupts Class / Lab)</option>
                      <option value="Urgent Priority">Urgent Priority (Flooding / Electrical / Safety)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue clearly so the maintenance team knows what equipment or replacement parts are needed..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Photo Attachment Section (Upload OR Live Camera) */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Visual Evidence (Upload Photo or Take Picture)
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!imagePreview && !isCameraOpen && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload size={20} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Upload from Device</span>
                      <span className="text-xs text-slate-400">PNG, JPG up to 5MB</span>
                    </button>

                    <button
                      type="button"
                      onClick={startCamera}
                      className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera size={20} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Take Photo with Camera</span>
                      <span className="text-xs text-slate-400">Use device webcam or phone camera</span>
                    </button>
                  </div>
                )}

                {/* Live Camera Viewfinder */}
                {isCameraOpen && (
                  <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-200">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-72 object-cover" />
                    <div className="p-4 bg-slate-900/90 flex justify-between items-center">
                      <span className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Camera Active
                      </span>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="px-4 py-2 bg-slate-700 text-white rounded-lg text-xs font-medium hover:bg-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-500 flex items-center gap-1.5"
                        >
                          <Camera size={14} /> Capture Snapshot
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Captured or Uploaded Image Preview */}
                {imagePreview && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={imagePreview} alt="Attached issue" className="w-24 h-24 object-cover rounded-lg border border-slate-200" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 size={16} className="text-emerald-600" /> Photo Attached Ready
                        </p>
                        <p className="text-xs text-slate-500 mt-1">This image will be visible to assigned technicians and admins.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove photo"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 text-white rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
                >
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : 'Submit Maintenance Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}