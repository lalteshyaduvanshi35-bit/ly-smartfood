import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle2, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  googleProvider,
  openAiProvider
} from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  currentLang?: Language;
  canCloseWithoutLogin?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  canCloseWithoutLogin = false,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset errors when mode or modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userProfile: UserProfile = {
        fullName: user.displayName || user.email?.split('@')[0] || 'Google User',
        phone: user.phoneNumber || '+91 9876543210',
        email: user.email || undefined,
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem('smart_food_user', JSON.stringify(userProfile));
      setIsSubmitting(false);
      onLoginSuccess(userProfile);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setIsSubmitting(false);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('गूगल लॉग इन रद्द किया गया / Google sign-in was cancelled.');
      } else {
        setError(err.message || 'गूगल लॉग इन में विफल! / Google login failed. Please try Email & Password.');
      }
    }
  };

  const handleChatGPTAuth = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const result = await signInWithPopup(auth, openAiProvider);
      const user = result.user;

      const userProfile: UserProfile = {
        fullName: user.displayName || user.email?.split('@')[0] || 'ChatGPT User',
        phone: '+91 9876543210',
        email: user.email || undefined,
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem('smart_food_user', JSON.stringify(userProfile));
      setIsSubmitting(false);
      onLoginSuccess(userProfile);
    } catch (err: any) {
      console.warn('ChatGPT OAuth fallback:', err);
      setIsSubmitting(false);
      // Prompt user to enter their ChatGPT / OpenAI Email directly via Firebase Email Auth
      setError('Enter your ChatGPT/OpenAI account email below to log in directly with Email & Password. / अपने ChatGPT ईमेल आईडी और पासवर्ड का उपयोग करके नीचे लॉग इन करें।');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address / सही ईमेल आईडी दर्ज करें');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long / पासवर्ड कम से कम 6 अक्षरों का होना चाहिए');
      return;
    }

    if (mode === 'signup' && (!fullName.trim() || fullName.trim().length < 2)) {
      setError('Please enter your full name / अपना पूरा नाम दर्ज करें');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        // Create user with Email and Password in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        // Update Firebase User Profile
        if (fullName.trim()) {
          await updateProfile(user, { displayName: fullName.trim() });
        }

        const userProfile: UserProfile = {
          fullName: fullName.trim() || user.email?.split('@')[0] || 'User',
          phone: phone.trim() ? `+91${phone.replace(/\D/g, '')}` : '+91 9876543210',
          email: user.email || email.trim(),
          isLoggedIn: true,
          loginTime: new Date().toISOString(),
        };

        localStorage.setItem('smart_food_user', JSON.stringify(userProfile));
        setIsSubmitting(false);
        onLoginSuccess(userProfile);
      } else {
        // Sign in user with Email and Password
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        const userProfile: UserProfile = {
          fullName: user.displayName || user.email?.split('@')[0] || 'Customer',
          phone: phone.trim() ? `+91${phone.replace(/\D/g, '')}` : '+91 9876543210',
          email: user.email || email.trim(),
          isLoggedIn: true,
          loginTime: new Date().toISOString(),
        };

        localStorage.setItem('smart_food_user', JSON.stringify(userProfile));
        setIsSubmitting(false);
        onLoginSuccess(userProfile);
      }
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      setIsSubmitting(false);

      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('खाता नहीं मिला या पासवर्ड गलत है! / User not found or incorrect password.');
      } else if (err.code === 'auth/wrong-password') {
        setError('गलत पासवर्ड! कृपया पुनः प्रयास करें / Incorrect password. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('यह ईमेल पहले से पंजीकृत है! कृपया लॉग इन करें / Email already registered. Please log in.');
      } else if (err.code === 'auth/invalid-email') {
        setError('अमान्य ईमेल पता! / Invalid email address format.');
      } else if (err.code === 'auth/weak-password') {
        setError('कमजोर पासवर्ड! कृपया 6 या अधिक अक्षरों का पासवर्ड चुनें / Password too weak (min 6 characters).');
      } else {
        setError(err.message || 'प्रमाणीकरण विफल! / Authentication failed. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white p-6 text-center relative">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
            <Sparkles className="w-7 h-7 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-black tracking-tight">LY Smart Food Delivery</h2>
          <p className="text-xs text-orange-100 mt-1 font-medium">
            Firebase Authentication (Google, ChatGPT & Email)
          </p>

          {canCloseWithoutLogin && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 rounded-full w-8 h-8 flex items-center justify-center font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Social Login Buttons */}
        <div className="p-6 pb-2 space-y-2.5">
          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.99] text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google (गूगल से जारी रखें)</span>
          </button>

          {/* Continue with ChatGPT */}
          <button
            type="button"
            onClick={handleChatGPTAuth}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-emerald-900 hover:bg-emerald-950 active:scale-[0.99] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-60"
          >
            <div className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px]">
              🤖
            </div>
            <span>Continue with ChatGPT (ChatGPT से जारी रखें)</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              OR (अथवा Email Login)
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-orange-600 border-b-2 border-orange-500 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login (लॉग इन)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-orange-600 border-b-2 border-orange-500 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up (रजिस्टर करें)</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 pt-4 space-y-4">
          <form onSubmit={handleAuth} className="space-y-3">
            {mode === 'signup' && (
              <>
                {/* Full Name Input */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-500" />
                    Full Name (पूरा नाम)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 rounded-xl px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all font-medium"
                    required
                  />
                </div>

                {/* Optional Phone Input */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-500" />
                    Mobile Number (मोबाइल नंबर - optional)
                  </label>
                  <div className="flex rounded-xl border border-slate-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 overflow-hidden transition-all">
                    <span className="bg-slate-50 text-slate-600 font-bold text-xs px-3 flex items-center border-r border-slate-200">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, ''));
                        setError('');
                      }}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="w-full px-3 py-1.5 text-sm text-slate-800 font-mono placeholder-slate-400 outline-none font-medium"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-orange-500" />
                Email Address (ईमेल आईडी / ChatGPT Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="name@example.com"
                className="w-full border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 rounded-xl px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all font-medium"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-orange-500" />
                Password (पासवर्ड)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                minLength={6}
                className="w-full border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 rounded-xl px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all font-medium"
                required
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-xl font-medium text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold text-sm py-2.5 rounded-xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>
                {isSubmitting
                  ? 'Processing...'
                  : mode === 'login'
                  ? 'Login with Email (लॉग इन करें)'
                  : 'Create Firebase Account (साइन अप करें)'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-1">
            <p className="text-[11px] text-slate-400">
              🔒 Firebase Secure Auth • Google, ChatGPT & Email Support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

