// src/app/dashboard/security/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TwoFactorSetup from '@/components/security/TwoFactorSetup';
import DeviceManager from '@/components/security/DeviceManager';
import SecurityLog from '@/components/security/SecurityLog';
import PasswordSettings from '@/components/security/PasswordSettings';
import { 
  ShieldCheck, 
  Key, 
  Smartphone, 
  BookOpen, 
  ChevronRight,
  Shield,
  Eye,
  Lock,
  CheckCircle
} from 'lucide-react';

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const securityFeatures = [
    {
      id: '2fa',
      name: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account.',
      status: 'Enabled',
      statusColor: 'green',
      icon: ShieldCheck,
      component: <TwoFactorSetup />
    },
    {
      id: 'password',
      name: 'Password & Security',
      description: 'Manage your password and security questions.',
      status: 'Last changed 3 months ago',
      statusColor: 'yellow',
      icon: Key,
      component: <PasswordSettings />
    },
    {
      id: 'devices',
      name: 'Device Management',
      description: 'Review and manage devices with access to your account.',
      status: '3 active devices',
      statusColor: 'blue',
      icon: Smartphone,
      component: <DeviceManager />
    },
    {
      id: 'activity',
      name: 'Security Activity Log',
      description: 'Review recent security-related activities.',
      status: 'Last login today',
      statusColor: 'blue',
      icon: BookOpen,
      component: <SecurityLog />
    }
  ];
  
  const getStatusColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'yellow': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'blue': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const ActiveComponent = securityFeatures.find(f => f.id === activeTab)?.component;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Security Center</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Manage your account security settings and preferences
        </p>
      </div>

      {/* Security Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-700"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-green-500"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="85, 100"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-green-500 mb-1" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">85%</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Security Score is Strong</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                You have taken excellent steps to protect your account.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm">
            <span className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4 mr-1" /> Strong Password
            </span>
            <span className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4 mr-1" /> Two-Factor Authentication
            </span>
            <span className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4 mr-1" /> Secure Devices
            </span>
          </div>
        </div>
      </motion.div>

      {/* Security Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Navigation */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {securityFeatures.map(feature => {
              const Icon = feature.icon;
              return (
                <motion.button
                  key={feature.id}
                  onClick={() => setActiveTab(feature.id)}
                  whileHover={{ scale: 1.02 }}
                  className={`w-full p-4 border-2 rounded-2xl text-left transition-all ${
                    activeTab === feature.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl">
                        <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{feature.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{feature.description}</p>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${
                      activeTab === feature.id ? 'transform translate-x-1' : ''
                    }`} />
                  </div>
                  <div className="mt-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColorClass(feature.statusColor)}`}>
                      {feature.status}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
          >
            {ActiveComponent}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
