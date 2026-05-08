import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shirt, ArrowRight, Chrome, Lock, User, AtSign, Phone, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const { signIn, signUpWithEmail, signInWithEmail, user, setupRecaptcha, signInWithPhone, verifyOtp } = useAuth();
  const navigate = useNavigate();
  
  // Email states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Phone states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate('/profile');
  }, [user, navigate]);

  useEffect(() => {
    if (authMethod === 'phone') {
      setupRecaptcha('recaptcha-container');
    }
  }, [authMethod, setupRecaptcha]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn();
      navigate('/profile');
    } catch (error: any) {
      console.error("Sign in error:", error);
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !fullName)) return;
    
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, fullName);
      }
      navigate('/profile');
    } catch (error: any) {
      console.error("Auth error:", error);
      setError(error.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    setLoading(true);
    setError(null);
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const result = await signInWithPhone(formattedPhone);
      setConfirmationResult(result);
      setOtpStep(true);
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      if (error.code === 'auth/operation-not-allowed') {
        setError('Firebase Authentication এ "Phone" provider টি enable করা নেই। এটি ঠিক করতে Firebase Console > Build > Authentication > Sign-in method এ গিয়ে "Phone" enable করুন। আপনার অ্যাপে OTP পাঠানোর জন্য এটি বাধ্যতামূলক।');
      } else if (error.code === 'auth/too-many-requests') {
        setError('অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।');
      } else if (error.code === 'auth/invalid-phone-number') {
        setError('ফোন নম্বরটি সঠিক নয়। দয়া করে ১০ ডিজিটের নম্বর দিন।');
      } else {
        setError(error.message || 'OTP পাঠাতে ব্যর্থ হয়েছে। নম্বরটি টেকনিক্যালি সঠিক কিনা যাচাই করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !phoneNumber) return;

    setLoading(true);
    setError(null);
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      await verifyOtp(formattedPhone, otp);
      navigate('/profile');
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      setError('সঠিক OTP দিন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex bg-neutral-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale" 
            alt="Vintage Background"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent"></div>
        
        <div className="relative z-10 text-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-white inline-block rounded-full rotate-12 shadow-2xl"
          >
            <Shirt className="w-12 h-12 text-neutral-900" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-display font-bold text-white italic mb-6 leading-tight"
          >
            Elevate your <br /> Streetwear
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 max-w-sm mx-auto text-sm uppercase tracking-[0.2em] font-medium"
          >
            Join the community of vintage collectors and sustainable stylists.
          </motion.p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex items-center justify-center p-8 lg:p-20 bg-white leading-relaxed">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <Link to="/" className="inline-block lg:hidden mb-8">
              <div className="bg-neutral-900 text-white p-3 rounded-2xl rotate-12">
                <Shirt className="w-6 h-6" />
              </div>
            </Link>
            <h2 className="text-4xl font-display font-bold italic mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-neutral-400 text-sm">
              {isLogin ? 'Sign in to access your vintage vault' : 'Start your sustainable fashion journey'}
            </p>
          </div>

          <div className="space-y-6">
            {/* Auth Method Toggles */}
            <div className="flex p-1 bg-neutral-50 rounded-2xl mb-8">
              <button 
                onClick={() => { setAuthMethod('email'); setOtpStep(false); }}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${authMethod === 'email' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                Password
              </button>
              <button 
                onClick={() => setAuthMethod('phone')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${authMethod === 'phone' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                Phone (OTP)
              </button>
            </div>

            <div id="recaptcha-container"></div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 text-red-500 text-xs font-bold rounded-xl text-center"
                >
                  {error}
                </motion.div>
              )}

              {authMethod === 'email' ? (
                <motion.div 
                  key={isLogin ? 'login' : 'signup'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Full Name"
                          required
                          className="w-full bg-neutral-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-neutral-900 transition-all"
                        />
                      </div>
                    )}
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                        className="w-full bg-neutral-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-neutral-900 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full bg-neutral-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-neutral-900 transition-all"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')} 
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>

                  <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-neutral-100"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-bold text-neutral-300 uppercase tracking-widest">or continue with</span>
                    <div className="flex-grow border-t border-neutral-100"></div>
                  </div>

                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-neutral-100 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-50 hover:border-neutral-200 transition-all shadow-sm disabled:opacity-50"
                  >
                    <Chrome className="w-4 h-4 text-red-500" />
                    Google account
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="phone-auth"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {!otpStep ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Phone (e.g. 9876543210)"
                          className="w-full bg-neutral-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-neutral-900 transition-all"
                          required
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                      >
                        {loading ? 'Sending...' : 'Send OTP'} 
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          className="w-full bg-neutral-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-neutral-900 transition-all tracking-[0.5em] font-bold text-center"
                          maxLength={6}
                          required
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                      >
                        {loading ? 'Verifying...' : 'Verify & Sign In'} 
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setOtpStep(false)}
                        className="w-full text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
                      >
                        Back to Change Number
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center mt-8">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-widest underline decoration-2 underline-offset-4"
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[10px] text-neutral-300 leading-relaxed max-w-xs mx-auto">
              By continuing, you agree to REWORN STREET's <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
