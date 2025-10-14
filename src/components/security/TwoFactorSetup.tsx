// src/components/security/TwoFactorSetup.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Smartphone, Key, CheckCircle, Copy, ArrowRight } from 'lucide-react';

export default function TwoFactorSetup() {
  const [step, setStep] = useState(1); // 1: Select, 2: Setup, 3: Verify, 4: Codes
  const [selectedMethod, setSelectedMethod] = useState('');
  
  // Mock data
  const qrCodeUrl = "/qr-code-placeholder.svg"; 
  const setupKey = "ABCD EFGH IJKL MNOP";
  const backupCodes = Array.from({ length: 8 }, () => Math.random().toString(36).substring(2, 8).toUpperCase());
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold ">
        Two-Factor Authentication (2FA)
      </h3>

      {step === 1 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <p className="text-slate-600 dark:text-slate-400">
            Add an extra layer of security to your account. When you sign in, you'll need to provide a code in addition to your password.
          </p>

          <button
            onClick={() => { setSelectedMethod('app'); setStep(2); }}
            className="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-left hover:border-blue-500 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold ">Authenticator App</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Recommended. Use an app like Google Authenticator or Authy.</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => { setSelectedMethod('sms'); setStep(2); }}
            className="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-left hover:border-blue-500 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold ">Text Message (SMS)</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Receive a code via SMS to your registered phone number.</p>
              </div>
            </div>
          </button>
        </motion.div>
      )}

      {step === 2 && selectedMethod === 'app' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <h4 className="font-semibold ">Set up with an Authenticator App</h4>
          <p className="text-slate-600 dark:text-slate-400">
            1. Install an authenticator app (e.g., Google Authenticator) on your device.
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            2. Scan the QR code below with your authenticator app.
          </p>
          <div className="flex justify-center p-4 bg-white border border-slate-200 rounded-xl">
            <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Can't scan? Enter this key manually:
          </p>
          <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <span className="font-mono ">{setupKey}</span>
            <button 
              onClick={() => navigator.clipboard.writeText(setupKey)}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
            >
              <Copy className="h-4 w-4 text-slate-400" />
            </button>
          </div>
          <button
            onClick={() => setStep(3)}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
          >
            Next: Verify
          </button>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <h4 className="font-semibold ">Verify Your Authenticator App</h4>
          <p className="text-slate-600 dark:text-slate-400">
            Enter the 6-digit code from your authenticator app to complete setup.
          </p>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              className="w-full text-center tracking-widest text-2xl py-3 bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl"
            />
          </div>
          <button
            onClick={() => setStep(4)}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
          >
            Verify & Enable 2FA
          </button>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-3 text-green-600 dark:text-green-400">
            <CheckCircle className="h-6 w-6" />
            <h4 className="text-lg font-semibold">2FA Enabled Successfully!</h4>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Save these backup codes in a safe place. They can be used to access your account if you lose your device.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-100 dark:bg-slate-700 p-4 rounded-xl">
            {backupCodes.map((code, index) => (
              <span key={index} className="font-mono text-center ">
                {code}
              </span>
            ))}
          </div>
          <div className="flex space-x-3">
            <button className="flex-1 bg-slate-200 dark:bg-slate-600 py-2 rounded-lg">Download Codes</button>
            <button 
              onClick={() => navigator.clipboard.writeText(backupCodes.join('\n'))}
              className="flex-1 bg-slate-200 dark:bg-slate-600 py-2 rounded-lg"
            >
              Copy Codes
            </button>
          </div>
          <button
            onClick={() => setStep(1)} // Or close modal
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
          >
            Done
          </button>
        </motion.div>
      )}
    </div>
  );
}
