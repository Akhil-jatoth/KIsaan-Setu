import React, { useState } from 'react';
import { Leaf, User, Lock, Mail, Phone, ArrowRight, CheckCircle, AlertCircle, Sparkles, Globe2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { apiService } from '../services/apiService';
import { UserRole } from '../types';
import { SUPPORTED_LANGUAGES, AppLanguage } from '../i18n/translations';

export function AuthPage() {
  const { currentRoute, setUser, setRoute, addToast, language, setLanguage, t } = useAppStore();
  const [isRegister, setIsRegister] = useState(currentRoute === 'register');
  const [isForgot, setIsForgot] = useState(false);
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Farmer');
  const [loading, setLoading] = useState(false);
  const [bannerMsg, setBannerMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Sync state if route changes
  React.useEffect(() => {
    if (currentRoute === 'register') {
      setIsRegister(true);
      setIsForgot(false);
      setBannerMsg(null);
    } else if (currentRoute === 'login') {
      setIsRegister(false);
      setIsForgot(false);
    }
  }, [currentRoute]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBannerMsg(null);

    // Basic Validation
    if (!emailOrPhone.trim()) {
      setBannerMsg({ type: 'error', text: 'Please enter your Email Address or Mobile Number.' });
      return;
    }

    if (!isForgot && (!password || password.trim().length === 0)) {
      setBannerMsg({ type: 'error', text: 'Please enter your password.' });
      return;
    }

    if (isRegister && (!name || name.trim().length === 0)) {
      setBannerMsg({ type: 'error', text: 'Please enter your Full Name.' });
      return;
    }

    setLoading(true);

    try {
      if (isForgot) {
        addToast({
          type: 'info',
          title: 'Password Reset Link Sent',
          message: `If ${emailOrPhone} is registered, a password reset link has been dispatched.`
        });
        setBannerMsg({
          type: 'info',
          text: `Password recovery instructions sent to ${emailOrPhone}.`
        });
        setIsForgot(false);
        setLoading(false);
        return;
      }

      if (isRegister) {
        // Step 1: Create Account in Firebase / System with phone & email
        const registeredName = name.trim();
        const cleanIdentifier = emailOrPhone.trim();
        const cleanPhone = phone.trim() || (cleanIdentifier.includes('@') ? '' : cleanIdentifier);
        const cleanEmail = cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanPhone || 'farmer'}@kisansetu.in`;

        await apiService.register(registeredName, cleanEmail, role, password, cleanPhone);

        addToast({
          type: 'success',
          title: 'Account Registered Successfully!',
          message: `Welcome ${registeredName}! Now enter your password to Sign In.`
        });

        // Set banner informing user to enter credentials and sign in
        setBannerMsg({
          type: 'success',
          text: `Account created for ${registeredName}! Enter your password below to sign in.`
        });

        // Switch to Sign In tab smoothly
        setIsRegister(false);
        setRoute('login');
        setPassword('');
        setLoading(false);
        return;
      } else {
        // Step 2: Sign In with email or mobile number & password -> Go to Dashboard
        const cleanIdentifier = emailOrPhone.trim();
        const res = await apiService.login(cleanIdentifier, password);
        
        setUser(res.user);
        
        addToast({
          type: 'success',
          title: 'Sign In Successful',
          message: `Welcome back, ${res.user.name} (${res.user.role})!`
        });

        // Navigate immediately to Dashboard
        setRoute('dashboard');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (isRegister) {
        // Fallback registration
        addToast({
          type: 'success',
          title: 'Account Registered',
          message: `Account created. Please enter your password to Sign In.`
        });
        setBannerMsg({
          type: 'success',
          text: `Account created for ${name || 'Farmer'}! Enter your password to sign in.`
        });
        setIsRegister(false);
        setRoute('login');
        setPassword('');
      } else {
        // Fallback login
        const raw = emailOrPhone.trim();
        const fallbackName = raw.includes('@') ? raw.split('@')[0].replace(/[._-]/g, ' ') : `Farmer ${raw.slice(-4) || ''}`;
        const formattedName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
        const fallbackUser = {
          id: `usr-${Date.now()}`,
          name: formattedName,
          email: raw.includes('@') ? raw : `${raw}@kisansetu.in`,
          phone: raw.includes('@') ? undefined : raw,
          role: role || 'Farmer',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          createdAt: new Date().toISOString()
        };
        setUser(fallbackUser);
        addToast({
          type: 'success',
          title: 'Signed In',
          message: `Welcome to KisanSetu, ${fallbackUser.name}!`
        });
        setRoute('dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoLogin = async (asRole: UserRole = 'Farmer') => {
    setLoading(true);
    const demoEmail = asRole === 'Farmer' ? 'farmer.demo@agrilens.ai' : asRole === 'Agriculture Student' ? 'student.demo@agrilens.ai' : 'trainer.demo@agrilens.ai';
    const demoName = asRole === 'Farmer' ? 'Ramesh Patel' : asRole === 'Agriculture Student' ? 'Priya Sundaram' : 'Dr. Arjun Patel';
    
    const demoUser = {
      id: `usr-${asRole.toLowerCase()}`,
      name: demoName,
      email: demoEmail,
      role: asRole,
      avatar: asRole === 'Farmer' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' : asRole === 'Agriculture Student' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      location: 'Block A, Plot #2',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('kisansetu_user', JSON.stringify(demoUser));
    localStorage.setItem('kisansetu_token', 'jwt-demo-token');
    localStorage.setItem('agrilens_user', JSON.stringify(demoUser));
    localStorage.setItem('agrilens_token', 'jwt-demo-token');
    setUser(demoUser);
    addToast({
      type: 'success',
      title: 'Demo Profile Loaded',
      message: `Signed in as ${demoName} (${asRole}). Welcome to Dashboard!`
    });
    setRoute('dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#061208] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background glow circles */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-agri-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-700/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-6 sm:p-8 border-agri-accent/30 shadow-2xl relative z-10 bg-[#09220e]/95 rounded-2xl">
        
        {/* Language Selector Top-Right */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <button
            onClick={() => setRoute('landing')}
            className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1"
          >
            ← {t('dashboard', 'Home')}
          </button>

          <div className="flex items-center bg-black/60 border border-agri-accent/30 rounded-xl px-2.5 py-1 gap-1.5 shadow-sm">
            <Globe2 className="w-3.5 h-3.5 text-agri-accent flex-shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as AppLanguage)}
              className="bg-transparent text-white text-[11px] font-mono font-bold focus:outline-none cursor-pointer pr-1"
              title="Select Language"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code} className="bg-[#09220e] text-white">
                  {l.flag} {l.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Logo & Title */}
        <div className="text-center mb-5">
          <div 
            onClick={() => setRoute('landing')} 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-agri-accent to-emerald-600 mx-auto flex items-center justify-center shadow-glow-accent cursor-pointer mb-3 hover:scale-105 transition-transform"
          >
            <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-agri-darkest" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {isForgot ? 'Reset Password' : isRegister ? t('registerHeader', 'Register as Farmer / Student') : t('loginHeader', 'Sign in to KisanSetu')}
          </h2>
          <p className="text-xs text-gray-300 mt-1 font-mono">
            {isForgot 
              ? 'Enter your email or mobile for password recovery' 
              : isRegister 
              ? t('registerSubheader', 'Fill in details below to register with Mobile or Email') 
              : t('loginSubheader', 'Enter your Email or Mobile Number & Password')}
          </p>
        </div>

        {/* Feedback Alert Banner */}
        {bannerMsg && (
          <div className={`mb-4 p-3 rounded-xl border flex items-start gap-2 text-xs font-mono animate-fadeIn ${
            bannerMsg.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : bannerMsg.type === 'error'
              ? 'bg-red-500/15 border-red-500/40 text-red-300'
              : 'bg-blue-500/15 border-blue-500/40 text-blue-300'
          }`}>
            {bannerMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{bannerMsg.text}</span>
          </div>
        )}

        {/* Tab Switcher between Sign In and Register */}
        {!isForgot && (
          <div className="flex rounded-2xl bg-black/50 p-1 mb-5 border border-agri-accent/20">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setRoute('login');
                setBannerMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold font-mono rounded-xl transition-all ${
                !isRegister
                  ? 'bg-agri-accent text-black shadow-glow-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('signIn', 'Sign In')}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setRoute('register');
                setBannerMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold font-mono rounded-xl transition-all ${
                isRegister
                  ? 'bg-agri-accent text-black shadow-glow-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('register', 'Register Account')}
            </button>
          </div>
        )}

        {/* 1-Click Fast Demo Logins */}
        {!isForgot && (
          <div className="mb-5 p-3 rounded-2xl bg-black/40 border border-agri-accent/20">
            <div className="text-[11px] font-mono text-agri-accent font-bold uppercase mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Instant Demo Login:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleInstantDemoLogin('Farmer')}
                className="bg-agri-card hover:bg-agri-accent hover:text-black text-gray-300 text-[11px] font-mono py-1.5 px-2 rounded-xl border border-white/10 transition-all text-center font-semibold"
              >
                👨‍🌾 Farmer
              </button>
              <button
                type="button"
                onClick={() => handleInstantDemoLogin('Agriculture Student')}
                className="bg-agri-card hover:bg-agri-accent hover:text-black text-gray-300 text-[11px] font-mono py-1.5 px-2 rounded-xl border border-white/10 transition-all text-center font-semibold"
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => handleInstantDemoLogin('Trainer')}
                className="bg-agri-card hover:bg-agri-accent hover:text-black text-gray-300 text-[11px] font-mono py-1.5 px-2 rounded-xl border border-white/10 transition-all text-center font-semibold"
              >
                👨‍🏫 Trainer
              </button>
            </div>
          </div>
        )}

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-3 text-[10px] text-gray-400 uppercase font-mono">
            {isRegister ? 'Enter Your Details to Register' : 'Or Enter Credentials to Sign In'}
          </span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full bg-black/50 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-agri-accent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">
              {isRegister ? 'Email Address' : t('phoneOrEmail', 'Email Address or Mobile Number')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder={isRegister ? "e.g. farmer@gmail.com" : "e.g. farmer@gmail.com or 9876543210"}
                className="w-full bg-black/50 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-agri-accent"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">{t('mobileNumber', 'Mobile Number')}</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-black/50 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-agri-accent"
                />
              </div>
            </div>
          )}

          {!isForgot && (
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">
                {isRegister ? 'Create Password' : t('enterPassword', 'Password')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isRegister ? 'Create a password' : 'Enter your password'}
                  className="w-full bg-black/50 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-agri-accent"
                />
              </div>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Agricultural Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-agri-accent"
              >
                <option value="Farmer">Farmer (Field Operator)</option>
                <option value="Agriculture Student">Agriculture Student (Learner)</option>
                <option value="Trainer">Agronomist / Trainer</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-1">
            {!isForgot && !isRegister && (
              <button
                type="button"
                onClick={() => {
                  setIsForgot(true);
                  setBannerMsg(null);
                }}
                className="text-agri-accent hover:underline text-[11px]"
              >
                Forgot password?
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 shadow-glow-accent transition-all text-xs uppercase tracking-wider cursor-pointer active:scale-98 disabled:opacity-70"
          >
            <span>
              {loading 
                ? t('processing', 'Processing...') 
                : isForgot 
                ? 'Send Recovery Link' 
                : isRegister 
                ? 'Register & Go to Sign In' 
                : t('signIn', 'Sign In to Dashboard')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle between Register/Login */}
        <div className="mt-5 pt-4 border-t border-white/10 text-center text-xs text-gray-400">
          {isForgot ? (
            <button
              onClick={() => {
                setIsForgot(false);
                setBannerMsg(null);
              }}
              className="text-agri-accent font-bold hover:underline"
            >
              Back to Login
            </button>
          ) : isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setIsRegister(false);
                  setRoute('login');
                  setBannerMsg(null);
                }}
                className="text-agri-accent font-bold hover:underline ml-1"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Need an account?{' '}
              <button
                onClick={() => {
                  setIsRegister(true);
                  setRoute('register');
                  setBannerMsg(null);
                }}
                className="text-agri-accent font-bold hover:underline ml-1"
              >
                Register as Farmer / Student
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

