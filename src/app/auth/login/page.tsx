// src/app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Smartphone, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneLogin, setPhoneLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    phone: '',
    email: '',
    password: '',
    otp: ''
  });
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('auth_token', 'demo_token');
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-12">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white">NeoBank</h1>
              <p className="text-blue-100">Secure Digital Banking</p>
            </div>
          </div>

          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <p className="text-white text-lg">Bank-grade security with 256-bit encryption</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-4"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <p className="text-white text-lg">Instant transfers and real-time notifications</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center space-x-4"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <p className="text-white text-lg">24/7 customer support and fraud protection</p>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10">
          <blockquote className="text-white/90 text-lg italic">
            "The most intuitive and secure banking experience I've ever used."
          </blockquote>
          <p className="text-blue-200 mt-2">— Sarah Johnson, Premium Customer</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-600">Sign in to your account</p>
            </div>

            {/* Login Method Toggle */}
            <div className="flex bg-slate-100 rounded-2xl p-1 mb-6">
              <button
                onClick={() => setPhoneLogin(true)}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all ${
                  phoneLogin 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Phone
              </button>
              <button
                onClick={() => setPhoneLogin(false)}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all ${
                  !phoneLogin 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Email
              </button>
            </div>

            {step === 'credentials' && (
              <form className="space-y-6">
                {/* Phone/Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {phoneLogin ? 'Phone Number' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <input
                      type={phoneLogin ? 'tel' : 'email'}
                      placeholder={phoneLogin ? '+1 (555) 123-4567' : 'john@example.com'}
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-900 placeholder-slate-400"
                      value={phoneLogin ? credentials.phone : credentials.email}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        [phoneLogin ? 'phone' : 'email']: e.target.value
                      }))}
                    />
                  </div>
                </div>

                {/* Password Input (for email login) */}
                {!phoneLogin && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-900 placeholder-slate-400 pr-12"
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Continue Button */}
                <motion.button
                  type="button"
                  onClick={() => phoneLogin ? setStep('otp') : handleLogin()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      {phoneLogin ? 'Send OTP' : 'Sign In'}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </motion.button>

                {!phoneLogin && (
                  <div className="text-center">
                    <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                      Forgot your password?
                    </Link>
                  </div>
                )}
              </form>
            )}

            {step === 'otp' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Verify Your Number</h3>
                  <p className="text-slate-600">We sent a 6-digit code to {credentials.phone}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-900 placeholder-slate-400 text-center text-2xl tracking-widest"
                    value={credentials.otp}
                    onChange={(e) => setCredentials(prev => ({ ...prev, otp: e.target.value }))}
                  />
                </div>

                <motion.button
                  type="button"
                  onClick={handleLogin}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Verify & Sign In
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </motion.button>

                <div className="flex justify-between text-sm">
                  <button 
                    onClick={() => setStep('credentials')}
                    className="text-slate-600 hover:text-slate-800 font-medium"
                  >
                    ← Back
                  </button>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Resend code (30s)
                  </button>
                </div>
              </div>
            )}

            {/* Sign Up Link */}
            <div className="text-center mt-8 pt-6 border-t border-slate-100">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              🔒 Protected by 256-bit SSL encryption
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
