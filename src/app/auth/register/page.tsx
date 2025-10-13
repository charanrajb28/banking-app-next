// src/app/auth/register/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Shield, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 1, name: 'Personal Info', desc: 'Basic information' },
  { id: 2, name: 'Contact', desc: 'Phone & email' },
  { id: 3, name: 'Security', desc: 'Password setup' },
  { id: 4, name: 'Verification', desc: 'Verify phone number' },
  { id: 5, name: 'Complete', desc: 'Account created' }
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleCreateAccount = async () => {
    setLoading(true);
    // Simulate account creation
    setTimeout(() => {
      setLoading(false);
      nextStep(); // Go to verification step
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      nextStep(); // Go to success step
    }, 1500);
  };

  const handleCompleteRegistration = () => {
    localStorage.setItem('auth_token', 'demo_token');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold text-slate-900">NeoBank</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Your Account</h1>
          <p className="text-slate-600">Join thousands of users who trust NeoBank</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="ml-2 hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'}`}>
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 max-w-2xl mx-auto"
        >
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Personal Information</h2>
                <p className="text-slate-600">Tell us about yourself</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-900"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-900"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-900"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Contact Information</h2>
                <p className="text-slate-600">How can we reach you?</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-900"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
                <p className="text-sm text-slate-500 mt-2">We'll send a verification code to this number</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-900"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Step 3: Security */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Password</h2>
                <p className="text-slate-600">Choose a strong password for your account</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-900 pr-12"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-sm text-slate-500 mt-2">Use 8+ characters with letters, numbers & symbols</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-900"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  I agree to the <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</Link>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Phone Verification */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Verify Phone Number</h2>
                <p className="text-slate-600">We sent a 6-digit code to {formData.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-900 placeholder-slate-400 text-center text-2xl tracking-widest"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <div className="text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Didn't receive code? Resend (30s)
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === 5 && (
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to NeoBank! 🎉</h2>
                <p className="text-slate-600">Your account has been created successfully.</p>
                <p className="text-sm text-slate-500 mt-2">You can now access all banking features securely.</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
            {currentStep > 1 && currentStep < 5 && (
              <motion.button
                onClick={prevStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </motion.button>
            )}

            {currentStep < 3 && (
              <motion.button
                onClick={nextStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
              >
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </motion.button>
            )}

            {currentStep === 3 && (
              <motion.button
                onClick={handleCreateAccount}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </motion.button>
            )}

            {currentStep === 4 && (
              <motion.button
                onClick={handleVerifyOTP}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Verify Code
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </motion.button>
            )}

            {currentStep === 5 && (
              <motion.button
                onClick={handleCompleteRegistration}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mx-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-8 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
              >
                Start Banking
                <ArrowRight className="h-5 w-5 ml-2" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Login Link */}
        {currentStep < 5 && (
          <div className="text-center mt-6">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
