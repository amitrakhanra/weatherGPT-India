import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { X, Check, ShieldCheck, Smartphone, Mail, ArrowLeft, RefreshCw, KeyRound, Lock } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  t: (key: string) => string;
}

type AuthMode = 'phone_otp' | 'email_password';
type OtpStep = 'enter_phone' | 'enter_otp' | 'success';

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  t
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('phone_otp');
  const [otpStep, setOtpStep] = useState<OtpStep>('enter_phone');

  // Phone OTP States
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [otpError, setOtpError] = useState('');

  // Email States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval: any = null;
    if (otpStep === 'enter_otp' && resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpStep, resendCountdown]);

  if (!isOpen) return null;

  // Format phone number
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
    setOtpError('');
  };

  // Send or Resend OTP
  const handleSendOtp = (isResend = false) => {
    if (phone.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSendingOtp(true);
    setOtpError('');

    // Generate a secure 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpStep('enter_otp');
      setResendCountdown(30);
      setOtpValues(['', '', '', '', '', '']);
      setShowSmsBanner(true);

      // Focus first input box
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }, 600);
  };

  // Handle single digit input
  const handleOtpDigitChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otpValues];
    newOtp[index] = digit;
    setOtpValues(newOtp);
    setOtpError('');

    // Auto advance
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace and navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
    }
    setOtpValues(newOtp);
    const nextIdx = Math.min(pasteData.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  // Auto fill demo code
  const handleAutofill = () => {
    if (!generatedOtp) return;
    const digits = generatedOtp.split('');
    setOtpValues(digits);
    setOtpError('');
    inputRefs.current[5]?.focus();
  };

  // Verify OTP submission
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpValues.join('');
    if (entered.length < 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    if (entered !== generatedOtp) {
      setOtpError('Invalid security code. Please check your SMS or tap Autofill.');
      return;
    }

    // Success
    setOtpStep('success');
    setShowSmsBanner(false);

    const userProfile: UserProfile = {
      phone: `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`,
      name: name.trim() || 'Verified Farmer',
      verified: true,
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem('weathergpt_user', JSON.stringify(userProfile));

    setTimeout(() => {
      onLoginSuccess(userProfile);
      onClose();
    }, 1400);
  };

  // Email login fallback
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpStep('success');

    const userProfile: UserProfile = {
      phone: email,
      name: name.trim() || email.split('@')[0],
      email: email,
      verified: true,
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem('weathergpt_user', JSON.stringify(userProfile));

    setTimeout(() => {
      onLoginSuccess(userProfile);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Real-time SMS Notification Toast Simulation */}
      {showSmsBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[92vw] max-w-md bg-[#1f254e] border-2 border-[#5ee9c8]/40 shadow-2xl rounded-2xl p-3.5 text-white animate-in slide-in-from-top duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#5ee9c8]/20 text-[#5ee9c8] flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#5ee9c8]/20 text-[#5ee9c8]">
                    SMS Delivered · 128-bit OTP
                  </span>
                  <span className="text-[10px] text-[#7d81a8]">Just now</span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed font-sans">
                  Your WeatherGPT India login security OTP is{' '}
                  <strong className="text-[#5ee9c8] font-mono text-sm tracking-wider px-1.5 py-0.5 bg-black/40 rounded border border-[#5ee9c8]/30">
                    {generatedOtp}
                  </strong>
                  . Valid for 10 minutes.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSmsBanner(false)}
              className="text-[#7d81a8] hover:text-white p-1 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-[#7d81a8]">Govt DLT SMS Gateway</span>
            <button
              type="button"
              onClick={handleAutofill}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#5ee9c8] hover:bg-[#4dd2b3] text-[#0b0e1f] transition-all flex items-center gap-1 shadow-md shadow-[#5ee9c8]/20"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Tap to Auto-fill ({generatedOtp})</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Dialog Box */}
      <div className="relative w-full max-w-md bg-[#161a38] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#7d81a8] hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#6c8dff]/20 text-[#6c8dff] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#5ee9c8]" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-display">
              {authMode === 'phone_otp' ? 'Secure Phone OTP Login' : t('loginTitle')}
            </h3>
          </div>
        </div>
        <p className="text-xs text-[#7d81a8] mb-5">
          {authMode === 'phone_otp'
            ? 'Verify your mobile number with a one-time password for secure access to hyperlocal advisory and weather alerts.'
            : t('loginSub')}
        </p>

        {/* Tab Switcher (Phone OTP vs Email) */}
        {otpStep !== 'success' && (
          <div className="grid grid-cols-2 p-1 bg-white/[0.04] border border-white/10 rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('phone_otp');
                setOtpStep('enter_phone');
                setOtpError('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                authMode === 'phone_otp'
                  ? 'bg-[#6c8dff] text-white shadow-md shadow-[#6c8dff]/30'
                  : 'text-[#7d81a8] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone OTP (Fast)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('email_password');
                setOtpError('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                authMode === 'email_password'
                  ? 'bg-[#6c8dff] text-white shadow-md shadow-[#6c8dff]/30'
                  : 'text-[#7d81a8] hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email &amp; Password</span>
            </button>
          </div>
        )}

        {/* SUCCESS STATE */}
        {otpStep === 'success' ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[#5ee9c8]/20 border border-[#5ee9c8]/40 flex items-center justify-center mx-auto text-[#5ee9c8]">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-bold text-base text-white font-display">
                Security Verified!
              </p>
              <p className="text-xs text-[#5ee9c8] mt-0.5">
                Logged in securely as {name || phone ? `+91 ${phone}` : 'User'}
              </p>
            </div>
            <p className="text-xs text-[#7d81a8] max-w-xs mx-auto">
              Your farm locations, rainfall threshold alerts and personalized preferences are synced.
            </p>
          </div>
        ) : authMode === 'phone_otp' ? (
          /* PHONE OTP FLOW */
          otpStep === 'enter_phone' ? (
            /* STEP 1: Phone & Name Input */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendOtp();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider mb-1.5">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra (Nadia)"
                  className="w-full bg-white/[0.06] text-white border border-white/15 focus:border-[#6c8dff] rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder-[#7d81a8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider mb-1.5">
                  Mobile Number <span className="text-[#e5555a]">*</span>
                </label>
                <div className="flex items-center rounded-xl bg-white/[0.06] border border-white/15 focus-within:border-[#6c8dff] overflow-hidden">
                  <div className="px-3 py-2.5 bg-white/[0.04] border-r border-white/10 text-xs font-semibold text-[#b7bbdb] flex items-center gap-1.5 shrink-0">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    autoFocus
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="98765 43210"
                    className="flex-1 bg-transparent text-white px-3.5 py-2.5 text-sm outline-none placeholder-[#7d81a8] font-mono tracking-wider"
                  />
                </div>
                <p className="text-[11px] text-[#7d81a8] mt-1.5">
                  We will send a 6-digit SMS security code to this number.
                </p>
              </div>

              {otpError && (
                <div className="text-xs text-[#e5555a] bg-[#e5555a]/10 border border-[#e5555a]/20 rounded-xl p-2.5">
                  {otpError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSendingOtp || phone.length < 10}
                className="w-full mt-2 bg-gradient-to-r from-[#6c8dff] to-[#5ee9c8] hover:brightness-110 disabled:opacity-40 text-[#0b0e1f] font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-[#6c8dff]/25 flex items-center justify-center gap-2"
              >
                {isSendingOtp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending Security Code…</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>Send Verification Code (OTP)</span>
                  </>
                )}
              </button>

              {/* Security Badges */}
              <div className="pt-2 flex items-center justify-between text-[10px] text-[#7d81a8] border-t border-white/10">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#5ee9c8]" />
                  256-bit Encrypted
                </span>
                <span>TRAI DLT Verified SMS</span>
                <span>Zero Spam</span>
              </div>
            </form>
          ) : (
            /* STEP 2: 6-Digit OTP Verification Screen */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep('enter_phone');
                    setOtpError('');
                  }}
                  className="flex items-center gap-1 text-xs text-[#5ee9c8] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change number</span>
                </button>
                <span className="text-xs font-mono text-[#b7bbdb]">
                  +91 {phone.slice(0, 5)} {phone.slice(5)}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider mb-2 text-center">
                  Enter 6-Digit SMS Security Code
                </label>
                {/* 6 Digit Inputs */}
                <div className="flex items-center justify-between gap-2 sm:gap-2.5">
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={idx === 0 ? handlePaste : undefined}
                      className="w-11 sm:w-12 h-12 text-center text-lg sm:text-xl font-bold font-mono text-white bg-white/[0.06] border border-white/20 focus:border-[#5ee9c8] focus:ring-2 focus:ring-[#5ee9c8]/30 rounded-xl outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              {otpError && (
                <div className="text-xs text-[#e5555a] bg-[#e5555a]/10 border border-[#e5555a]/20 rounded-xl p-2.5 text-center">
                  {otpError}
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                className="w-full bg-[#5ee9c8] hover:bg-[#4dd2b3] text-[#0b0e1f] font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-[#5ee9c8]/25 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify &amp; Secure Sign In</span>
              </button>

              {/* Resend & Demo helper */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#7d81a8]">
                {resendCountdown > 0 ? (
                  <span>Resend code in {resendCountdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp(true)}
                    className="text-[#6c8dff] hover:text-white transition-colors flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP via SMS</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleAutofill}
                  className="text-[#5ee9c8] hover:underline text-xs"
                >
                  Autofill code ({generatedOtp})
                </button>
              </div>
            </form>
          )
        ) : (
          /* EMAIL / PASSWORD FORM */
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider mb-1">
                {t('namePh')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full bg-white/[0.06] text-white border border-white/15 focus:border-[#6c8dff] rounded-xl px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider mb-1">
                {t('emailPh')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@domain.in"
                className="w-full bg-white/[0.06] text-white border border-white/15 focus:border-[#6c8dff] rounded-xl px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider mb-1">
                {t('passwordPh')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.06] text-white border border-white/15 focus:border-[#6c8dff] rounded-xl px-3 py-2 text-sm outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-[#6c8dff] hover:bg-[#5a7bed] text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-[#6c8dff]/25"
            >
              {t('loginBtn')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
