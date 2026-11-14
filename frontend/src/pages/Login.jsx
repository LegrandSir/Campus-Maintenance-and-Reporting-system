// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Building2, ShieldCheck, Clock, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Dynamically grab whichever name the backend uses
      const actualToken = response.data.access_token || response.data.token;
      
      if (actualToken) {
        sessionStorage.setItem('token', actualToken);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        setError('Login succeeded, but no token was received.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid university credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Optional helper for fast switching during your live presentation
  const fillDemoCredentials = (demoEmail, demoPass = 'password123') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0B1739] text-white p-12 relative overflow-hidden">
        {/* Top Logo */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
              <Building2 size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">CampusFix</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-950/80 border border-blue-800/60 px-3 py-1.5 rounded-full text-xs text-blue-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Portal Online
          </div>
        </div>
        
        {/* Hero Copy */}
        <div className="z-10 max-w-md my-auto">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-300 uppercase bg-blue-900/40 border border-blue-700/50 rounded-full">
            University Facility Operations
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Keep Your Campus<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Running Smoothly
            </span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            The centralized hub for university facility maintenance. Report issues, track SLA progress, and manage campus repairs in real time.
          </p>
        </div>

        {/* Footer Badges */}
        <div className="flex gap-8 z-10 text-sm text-slate-300 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-400" />
            <span>SSO & RBAC Protected</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-blue-400" />
            <span>24/7 SLA Tracking</span>
          </div>
        </div>
        
        {/* Animated Background Glows */}
        <div className="absolute -right-20 -bottom-20 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
        <div className="absolute -left-20 top-1/4 w-[350px] h-[350px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 relative">
        <div className="w-full max-w-md transition-all duration-500">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Sign in with your university email and password to access the maintenance portal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-center justify-between animate-pulse">
                <span>{error}</span>
              </div>
            )}
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                University Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@usiu.ac.ke"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Password Field with Working Eye Toggle */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                <button 
                  type="button"
                  onClick={() => window.alert('Please contact the Campus ICT Helpdesk (Ext. 999) to reset your university credentials.')}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input 
                id="remember" 
                type="checkbox" 
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer" 
              />
              <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none">
                Keep my session active on this tab
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#1e40af] hover:bg-blue-800 active:scale-[0.98] disabled:opacity-70 text-white font-semibold py-3 rounded-xl shadow-md shadow-blue-900/10 hover:shadow-lg transition-all flex justify-center items-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  VERIFYING CREDENTIALS...
                </>
              ) : (
                <>
                  SIGN IN TO PORTAL
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Need a staff or technician account?{' '}
            <span className="text-blue-600 font-medium">Contact Campus ICT Administration</span>
          </p>
        </div>
      </div>
    </div>
  );
}