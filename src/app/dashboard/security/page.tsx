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
  CheckCircle,
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
      component: <TwoFactorSetup />,
    },
    {
      id: 'password',
      name: 'Password & Security',
      description: 'Manage your password and security questions.',
      status: 'Last changed 3 months ago',
      statusColor: 'yellow',
      icon: Key,
      component: <PasswordSettings />,
    },
    {
      id: 'devices',
      name: 'Device Management',
      description: 'Review and manage devices with access to your account.',
      status: '3 active devices',
      statusColor: 'blue',
      icon: Smartphone,
      component: <DeviceManager />,
    },
    {
      id: 'activity',
      name: 'Security Activity Log',
      description: 'Review recent security-related activities.',
      status: 'Last login today',
      statusColor: 'blue',
      icon: BookOpen,
      component: <SecurityLog />,
    },
  ];

  const getStatusColorStyle = (color: string) => {
    switch (color) {
      case 'green':
        return {
          color: 'var(--green-600)',
          backgroundColor: 'var(--green-100)',
        };
      case 'yellow':
        return {
          color: 'var(--yellow-600)',
          backgroundColor: 'var(--yellow-100)',
        };
      case 'blue':
        return {
          color: 'var(--blue-600)',
          backgroundColor: 'var(--blue-50)',
        };
      default:
        return {
          color: 'var(--card-text-secondary)',
          backgroundColor: 'var(--card-bg-alt)',
        };
    }
  };

  const ActiveComponent = securityFeatures.find((f) => f.id === activeTab)?.component;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
          Security Center
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--card-text-secondary)' }}>
          Manage your account security settings and preferences
        </p>
      </div>

      {/* Security Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 shadow-lg"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative w-32 h-28">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  stroke="var(--card-bg-alt)"
                  strokeWidth="2.5"
                  fill="none"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  stroke="var(--green-600)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="85, 100"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2 }}
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <ShieldCheck
                  className="h-6 w-6 mb-1"
                  style={{ color: 'var(--green-600)' }}
                />
                <span
                  className="text-2xl font-bold"
                  style={{ color: 'var(--foreground)' }}
                >
                  85%
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                Your Security Score is Strong
              </h3>
              <p className="mt-1 text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                You have taken excellent steps to protect your account.
              </p>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm">
            {['Strong Password', 'Two-Factor Authentication', 'Secure Devices'].map(
              (label, idx) => (
                <span
                  key={idx}
                  className="flex items-center"
                  style={{ color: 'var(--green-600)' }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" /> {label}
                </span>
              )
            )}
          </div>
        </div>
      </motion.div>

      {/* Security Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Nav */}
        <div className="space-y-4">
          {securityFeatures.map((feature) => {
            const Icon = feature.icon;
            const active = activeTab === feature.id;
            const statusStyle = getStatusColorStyle(feature.statusColor);

            return (
              <motion.button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="w-full p-4 border-2 rounded-2xl text-left transition-all"
                style={{
                  backgroundColor: active ? 'var(--blue-50)' : 'var(--card-bg)',
                  borderColor: active ? 'var(--blue-600)' : 'var(--card-bg-alt)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: 'var(--card-bg-alt)' }}
                    >
                      <Icon className="h-5 w-5" style={{ color: 'var(--foreground)' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                        {feature.name}
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 transition-transform ${
                      active ? 'translate-x-1' : ''
                    }`}
                    style={{ color: 'var(--card-text-secondary)' }}
                  />
                </div>
                <div className="mt-3">
                  <span
                    className="px-2 py-1 text-xs font-medium rounded-full"
                    style={statusStyle}
                  >
                    {feature.status}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Right Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl p-6 shadow-lg col-span-2"
          style={{ backgroundColor: 'var(--card-bg)', color: 'var(--foreground)' }}
        >
          {ActiveComponent}
        </motion.div>
      </div>
    </div>
  );
}
