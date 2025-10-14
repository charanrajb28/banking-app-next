// src/components/security/PasswordSettings.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, RefreshCw, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';

export default function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock current password change date
  const lastChanged = '2025-07-13';

  // Password strength check
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { score: 0, label: 'None', color: 'bg-slate-300' };
    if (password.length < 8) return { score: 1, label: 'Very Weak', color: 'bg-red-500' };
    
    let score = 1; // Base for length
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return { score, label: 'Weak', color: 'bg-yellow-500' };
    if (score === 3) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const currentStrength = getPasswordStrength(currentPassword);
  const newStrength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid = currentPassword.length > 0 && newPassword.length > 0 && passwordsMatch && newStrength.score >= 3;

  const handleSave = () => {
    if (isFormValid) {
      setIsSaving(true);
      // Simulate API call
      setTimeout(() => {
        setIsSaving(false);
        // Reset form or show success
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold ">
        Password & Security
      </h3>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-400">Password Security</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              You last changed your password {new Date(lastChanged).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. It's recommended to change it every 3 months for security.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 text-slate-900 placeholder-slate-400"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 text-slate-900 placeholder-slate-400"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Password Strength Meter */}
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-slate-500 dark:text-slate-400">Password Strength</span>
              <span className={`text-sm font-medium ${newStrength.score >= 3 ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {newStrength.label}
              </span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${newStrength.color}`}
                style={{ width: `${(newStrength.score / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Password Requirements */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center">
              {newPassword.length >= 8 ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
              )}
              8+ characters
            </div>
            <div className="flex items-center">
              {/[A-Z]/.test(newPassword) ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
              )}
              Uppercase letter
            </div>
            <div className="flex items-center">
              {/[a-z]/.test(newPassword) ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
              )}
              Lowercase letter
            </div>
            <div className="flex items-center">
              {/\d/.test(newPassword) ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
              )}
              Number
            </div>
            <div className="flex items-center">
              {/[^A-Za-z0-9]/.test(newPassword) ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
              )}
              Special character (!@#$ etc.)
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 text-slate-900 placeholder-slate-400"
              placeholder="Re-enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          {confirmPassword.length > 0 && (
            <div className="mt-2 flex items-center text-sm">
              {passwordsMatch ? ( 
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> 
              ) : ( 
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" /> 
              )}
              <span className={passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </span>
            </div>
          )}
        </div>

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          disabled={!isFormValid || isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center ${
            isFormValid && !isSaving
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Changing Password...
            </>
          ) : (
            'Change Password'
          )}
        </motion.button>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
        <h4 className="font-semibold  mb-4">Recommended Actions</h4>
        
        <div className="space-y-3">
          <button className="flex items-center justify-between w-full p-3 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium ">Generate Strong Password</span>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </button>

          <button className="flex items-center justify-between w-full p-3 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium ">Enable Password Manager</span>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
