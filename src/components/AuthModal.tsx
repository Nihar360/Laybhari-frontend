import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useCart } from '../context/CartContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'otp' | 'login' | 'register';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, setAuthData } = useAuth();
  const { mergeGuestCart } = useCart();
  const [authMode, setAuthMode] = useState<AuthMode>('otp');

  // Email / Password Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Phone OTP State
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpMsg, setOtpMsg] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifierAuthModal) {
      (window as any).recaptchaVerifierAuthModal = new RecaptchaVerifier(auth, 'recaptcha-container-auth-modal', {
        'size': 'invisible',
        'callback': () => {}
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = otpPhone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    setErrorMsg(null);
    setOtpMsg(null);
    setIsLoading(true);

    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifierAuthModal;
      const formattedPhone = `+91${cleaned}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setOtpMsg(`Firebase SMS OTP sent to +91 ${cleaned}. Please check your phone.`);
    } catch (err: any) {
      console.error('Firebase send OTP error:', err);
      if ((window as any).recaptchaVerifierAuthModal) {
        try {
          (window as any).recaptchaVerifierAuthModal.clear();
          (window as any).recaptchaVerifierAuthModal = null;
        } catch (e) {}
      }

      if (err.code === 'auth/billing-not-enabled' || err.code === 'auth/operation-not-allowed') {
        try {
          const backendRes = await authService.sendOtp(cleaned);
          setOtpSent(true);
          setConfirmationResult(null);
          setOtpMsg(`⚠️ Firebase Billing disabled. Using Backend OTP fallback for +91 ${cleaned} (Test OTP: 123456).`);
        } catch (bErr: any) {
          setErrorMsg('Firebase Billing is not enabled in Firebase Console. Please upgrade to Blaze Plan or add Test Phone Numbers in Firebase Console.');
        }
      } else {
        setErrorMsg(err.message || 'Failed to send OTP via Firebase.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = otpPhone.replace(/\D/g, '');
    if (otpCode.length < 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    if (confirmationResult) {
      try {
        const credential = await confirmationResult.confirm(otpCode);
        const idToken = await credential.user.getIdToken();
        const res = await authService.firebaseLogin(idToken);
        setAuthData(res);
        await mergeGuestCart();
        onClose();
        return;
      } catch (err: any) {
        console.warn('Firebase OTP verification failed, trying backend fallback:', err);
      } finally {
        setIsLoading(false);
      }
    }

    try {
      const res = await authService.verifyOtp(cleaned, otpCode);
      setAuthData(res);
      await mergeGuestCart();
      onClose();
    } catch (err: any) {
      console.error('Backend OTP verification error:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Invalid or expired OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      let res;
      if (authMode === 'login') {
        res = await login({ email: email.trim(), password });
      } else {
        res = await register({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
      }
      await mergeGuestCart();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(3px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          animation: 'fadeIn 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ backgroundColor: '#382012', padding: '24px 24px 16px', position: 'relative', textAlign: 'center', color: '#FFFFFF' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: '#FED7AA', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
          
          <img
            src="/logo-badge.jpg"
            alt="Laybhari Vlogs Logo"
            style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #D97706', margin: '0 auto 10px', display: 'block', objectFit: 'cover' }}
          />
          <h2 style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '1px' }}>LAY BHARI VLOGS</h2>
          <p style={{ fontSize: '12px', color: '#FED7AA', marginTop: '2px' }}>
            {authMode === 'otp' ? 'Quick Phone OTP Login' : authMode === 'login' ? 'Sign in with Email & Password' : 'Create a New Account'}
          </p>

          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', marginTop: '16px', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: '8px', padding: '3px', gap: '2px' }}>
            <button
              onClick={() => { setAuthMode('otp'); setErrorMsg(null); setOtpMsg(null); }}
              style={{
                flex: 1,
                padding: '7px 4px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 800,
                color: authMode === 'otp' ? '#382012' : '#FED7AA',
                backgroundColor: authMode === 'otp' ? '#FFFFFF' : 'transparent',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              📱 Phone OTP
            </button>
            <button
              onClick={() => { setAuthMode('login'); setErrorMsg(null); }}
              style={{
                flex: 1,
                padding: '7px 4px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 800,
                color: authMode === 'login' ? '#382012' : '#FED7AA',
                backgroundColor: authMode === 'login' ? '#FFFFFF' : 'transparent',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ✉️ Email Sign In
            </button>
            <button
              onClick={() => { setAuthMode('register'); setErrorMsg(null); }}
              style={{
                flex: 1,
                padding: '7px 4px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 800,
                color: authMode === 'register' ? '#382012' : '#FED7AA',
                backgroundColor: authMode === 'register' ? '#FFFFFF' : 'transparent',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              👤 Register
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {errorMsg && (
            <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {otpMsg && (
            <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
              ✓ {otpMsg}
            </div>
          )}

          {authMode === 'otp' ? (
            !otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '6px' }}>Mobile Phone Number *</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ padding: '10px 14px', backgroundColor: '#FAF5EF', border: '1px solid #E8DFD5', borderRadius: '6px', fontSize: '14px', fontWeight: 800, color: '#382012' }}>+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, ''))}
                      style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #E8DFD5', fontSize: '15px', fontWeight: 700, outline: 'none' }}
                      autoFocus
                    />
                  </div>
                </div>

                <div id="recaptcha-container-auth-modal" style={{ marginBottom: '10px' }}></div>

                <button
                  type="submit"
                  disabled={isLoading || otpPhone.length < 10}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', opacity: (isLoading || otpPhone.length < 10) ? 0.6 : 1 }}
                >
                  {isLoading ? 'SENDING OTP...' : 'Get OTP →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#382012' }}>Enter 6-Digit OTP *</label>
                    <button type="button" onClick={() => setOtpSent(false)} style={{ fontSize: '12px', color: '#C2410C', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}>Change Number</button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '2px solid #C2410C', fontSize: '20px', fontWeight: 900, textAlign: 'center', letterSpacing: '6px', outline: 'none' }}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.length < 6}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', opacity: (isLoading || otpCode.length < 6) ? 0.6 : 1 }}
                >
                  {isLoading ? 'VERIFYING...' : 'VERIFY & SIGN IN'}
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleEmailSubmit}>
              {authMode === 'register' && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <UserIcon size={16} color="#786C62" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aniket Patil"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', border: '1px solid #E8DFD5', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#786C62" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="email"
                    required
                    placeholder="customer@laybhari.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', border: '1px solid #E8DFD5', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="#786C62" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', border: '1px solid #E8DFD5', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#786C62" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', border: '1px solid #E8DFD5', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? 'Processing...' : authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
