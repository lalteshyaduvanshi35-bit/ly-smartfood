import React, { useState, useEffect } from 'react';
import { Phone, User, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { UserProfile, Language } from '../types';

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
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(30);
  const [generatedOtp, setGeneratedOtp] = useState('1234');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please enter your valid Full Name / अपना पूरा नाम दर्ज करें');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number / 10 अंकों का मोबाइल नंबर दर्ज करें');
      return;
    }

    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
      setTimer(30);
      setGeneratedOtp('1234');
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter OTP');
      return;
    }

    if (otp !== '1234' && otp !== generatedOtp) {
      setError('Invalid OTP! Please enter 1234 (Demo OTP)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const userProfile: UserProfile = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem('smart_food_user', JSON.stringify(userProfile));
      onLoginSuccess(userProfile);
    }, 600);
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    setTimer(30);
    setError('');
    setOtp('');
    // reset notification
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white p-6 text-center relative">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">LY Smart Food Delivery</h2>
          <p className="text-xs text-orange-100 mt-1 font-medium">
            Fastest Delivery • Best Offers • Live Order Tracking
          </p>

          {canCloseWithoutLogin && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 rounded-full w-8 h-8 flex items-center justify-center font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 space-y-5">
          
          {step === 'details' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center mb-2">
                <h3 className="font-bold text-slate-900 text-base">Login or Create Account</h3>
                <p className="text-xs text-slate-500">Enter your details to receive instant OTP verification</p>
              </div>

              {/* Full Name Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
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
                  className="w-full border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all font-medium"
                  required
                  autoFocus
                />
              </div>

              {/* Phone Number Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-orange-500" />
                  Mobile Number (मोबाइल नंबर)
                </label>
                <div className="flex rounded-xl border border-slate-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 overflow-hidden transition-all">
                  <span className="bg-slate-50 text-slate-600 font-bold text-xs px-3.5 flex items-center border-r border-slate-200">
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
                    className="w-full px-3.5 py-3 text-sm text-slate-800 font-mono placeholder-slate-400 outline-none font-medium"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-xl font-medium text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Sending OTP...' : 'Send OTP (ओटीपी प्राप्त करें)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-400">
                  🔒 By continuing, you agree to LY Smart Food Delivery Terms & Privacy Policy
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
              <div className="text-center mb-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Verify Phone Number</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  OTP sent to <b>+91 {phone}</b>
                </p>
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-[11px] text-orange-600 font-bold hover:underline mt-1"
                >
                  Change Name / Number
                </button>
              </div>

              {/* Demo Helper Badge */}
              <div 
                onClick={() => setOtp('1234')}
                className="bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-xl p-2.5 text-center cursor-pointer transition-colors"
              >
                <span className="text-xs text-amber-900 font-semibold block">
                  ⚡ Demo Mode OTP: <b className="text-orange-600 text-sm tracking-wider font-mono">1234</b>
                </span>
                <span className="text-[10px] text-amber-700">Click to Auto-fill Demo OTP</span>
              </div>

              {/* OTP Field */}
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  placeholder="1234"
                  maxLength={6}
                  className="w-full border-2 border-orange-200 focus:border-orange-500 rounded-2xl p-3.5 text-center text-2xl font-mono tracking-widest font-black text-slate-900 outline-none transition-all shadow-inner"
                  autoFocus
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
                className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-sm py-3.5 rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isSubmitting ? 'Verifying...' : 'Verify & Order Food'}</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">Didn't receive code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timer > 0}
                  className={`font-bold flex items-center gap-1 ${
                    timer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-orange-600 hover:underline cursor-pointer'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${timer > 0 ? '' : 'animate-spin'}`} />
                  <span>{timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
