// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, Building2, ShieldCheck, Clock } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0B1739] text-white p-12 relative overflow-hidden">
        <div className="flex items-center gap-2 z-10">
          <div className="bg-blue-500 p-2 rounded-lg"><Building2 size={24} /></div>
          <span className="text-2xl font-bold tracking-tight">CampusFix</span>
        </div>
        
        <div className="z-10 max-w-md mt-20">
          <h1 className="text-5xl font-bold leading-tight mb-6">Keep Your Campus<br/>Running Smoothly</h1>
          <p className="text-slate-300 text-lg">The centralized hub for university facility maintenance. Report issues, track progress, and manage campus repairs with ease.</p>
        </div>

        <div className="flex gap-8 z-10 mb-8 text-sm text-slate-300">
          <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-blue-400"/> SECURE AUTH</div>
          <div className="flex items-center gap-2"><Clock size={18} className="text-blue-400"/> 24/7 SUPPORT</div>
        </div>
        
        {/* Placeholder for Isometric Graphic / Future Splide Carousel */}
        <div className="absolute right-0 bottom-10 w-[120%] opacity-40 translate-x-32 translate-y-16">
           <div className="w-full h-96 bg-gradient-to-tr from-blue-900 to-transparent rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500 mb-8">Enter your university credentials to access your maintenance portal.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</p>}
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">University Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john.doe@usiu.ac.ke"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="password"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
                <Eye className="absolute right-3 top-3 h-5 w-5 text-slate-400 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
              <span className="text-sm text-slate-600">Remember this device for 30 days</span>
            </div>

            <button type="submit" className="w-full bg-[#1e40af] hover:bg-blue-800 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 mt-4">
              SIGN IN TO PORTAL <span className="text-lg leading-none">&rarr;</span>
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-white px-4 text-slate-400">Or Continue With</span></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            
            <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
               Google
            </button>
          </div>
          
          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account yet? <a href="#" className="text-blue-600 font-medium hover:underline">Contact Campus Administration</a>
          </p>
        </div>
      </div>
    </div>
  );
}