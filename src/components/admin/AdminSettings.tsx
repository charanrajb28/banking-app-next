// src/components/admin/AdminSettings.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Bell, 
  Globe, 
  Database,
  Lock,
  Key,
  Mail,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  DollarSign,
  Percent,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  
  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'NeoBank',
    supportEmail: 'support@neobank.com',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en',
    maintenanceMode: false
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    requireTwoFactor: true,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    ipWhitelist: false,
    emailVerification: true,
    phoneVerification: true
  });

  // Transaction Settings State
  const [transactionSettings, setTransactionSettings] = useState({
    dailyLimit: 10000,
    monthlyLimit: 100000,
    minTransactionAmount: 1,
    maxTransactionAmount: 50000,
    transactionFee: 0,
    withdrawalFee: 2.5,
    autoFraudDetection: true,
    requireApprovalAbove: 25000
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    systemAlerts: true,
    securityAlerts: true,
    transactionAlerts: true
  });

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'transactions', name: 'Transactions', icon: DollarSign },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'integrations', name: 'Integrations', icon: Database }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">System Settings</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Configure platform settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                General Settings
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={generalSettings.platformName}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, platformName: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Timezone
                  </label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Default Currency
                  </label>
                  <select
                    value={generalSettings.currency}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Maintenance Mode</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Temporarily disable user access for maintenance</p>
                </div>
                <button
                  onClick={() => setGeneralSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    generalSettings.maintenanceMode ? 'bg-red-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    generalSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Security Settings Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                Security Settings
              </h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Require Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Mandate 2FA for all users</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSecuritySettings(prev => ({ ...prev, requireTwoFactor: !prev.requireTwoFactor }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      securitySettings.requireTwoFactor ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.requireTwoFactor ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Email Verification Required</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Users must verify email on signup</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSecuritySettings(prev => ({ ...prev, emailVerification: !prev.emailVerification }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      securitySettings.emailVerification ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.emailVerification ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Phone Verification Required</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Users must verify phone number</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSecuritySettings(prev => ({ ...prev, phoneVerification: !prev.phoneVerification }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      securitySettings.phoneVerification ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.phoneVerification ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Password Expiry (days)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Transaction Settings Tab */}
          {activeTab === 'transactions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                Transaction Settings
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Daily Transaction Limit ($)
                  </label>
                  <input
                    type="number"
                    value={transactionSettings.dailyLimit}
                    onChange={(e) => setTransactionSettings(prev => ({ ...prev, dailyLimit: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Monthly Transaction Limit ($)
                  </label>
                  <input
                    type="number"
                    value={transactionSettings.monthlyLimit}
                    onChange={(e) => setTransactionSettings(prev => ({ ...prev, monthlyLimit: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Transaction Amount ($)
                  </label>
                  <input
                    type="number"
                    value={transactionSettings.minTransactionAmount}
                    onChange={(e) => setTransactionSettings(prev => ({ ...prev, minTransactionAmount: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Maximum Transaction Amount ($)
                  </label>
                  <input
                    type="number"
                    value={transactionSettings.maxTransactionAmount}
                    onChange={(e) => setTransactionSettings(prev => ({ ...prev, maxTransactionAmount: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Transaction Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={transactionSettings.transactionFee}
                    onChange={(e) => setTransactionSettings(prev => ({ ...prev, transactionFee: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Withdrawal Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={transactionSettings.withdrawalFee}
                    onChange={(e) => setTransactionSettings(prev => ({ ...prev, withdrawalFee: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Require Approval Above ($)
                  </label>
                  <input
                    type="number"
                    value={transactionSettings.requireApprovalAbove}
                    onChange={(e) => setTransactionSettings(prev => ({ ...prev, requireApprovalAbove: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Auto Fraud Detection</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Automatically flag suspicious transactions</p>
                  </div>
                </div>
                <button
                  onClick={() => setTransactionSettings(prev => ({ ...prev, autoFraudDetection: !prev.autoFraudDetection }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    transactionSettings.autoFraudDetection ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    transactionSettings.autoFraudDetection ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Notifications Settings Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                Notification Settings
              </h4>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send notifications via email', icon: Mail, color: 'blue' },
                  { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Send notifications via SMS', icon: Smartphone, color: 'green' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Send browser push notifications', icon: Bell, color: 'purple' },
                  { key: 'systemAlerts', label: 'System Alerts', desc: 'Critical system notifications', icon: AlertTriangle, color: 'yellow' },
                  { key: 'securityAlerts', label: 'Security Alerts', desc: 'Security-related notifications', icon: Shield, color: 'red' },
                  { key: 'transactionAlerts', label: 'Transaction Alerts', desc: 'Transaction notifications', icon: DollarSign, color: 'indigo' }
                ].map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div key={notification.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 bg-${notification.color}-100 dark:bg-${notification.color}-900/20 rounded-lg`}>
                          <Icon className={`h-5 w-5 text-${notification.color}-600 dark:text-${notification.color}-400`} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{notification.label}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{notification.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotificationSettings(prev => ({ 
                          ...prev, 
                          [notification.key]: !prev[notification.key as keyof typeof notificationSettings]
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notificationSettings[notification.key as keyof typeof notificationSettings] ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings[notification.key as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Integrations Settings Tab */}
          {activeTab === 'integrations' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                Integrations & APIs
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Payment Gateway', status: 'Connected', icon: DollarSign, color: 'green' },
                  { name: 'Email Service', status: 'Connected', icon: Mail, color: 'blue' },
                  { name: 'SMS Gateway', status: 'Disconnected', icon: Smartphone, color: 'red' },
                  { name: 'KYC Service', status: 'Connected', icon: Users, color: 'green' },
                  { name: 'Analytics Platform', status: 'Connected', icon: BarChart3, color: 'purple' },
                  { name: 'Cloud Storage', status: 'Connected', icon: Database, color: 'indigo' }
                ].map((integration, index) => {
                  const Icon = integration.icon;
                  return (
                    <motion.div
                      key={integration.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:border-blue-500 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 bg-${integration.color}-100 dark:bg-${integration.color}-900/20 rounded-xl`}>
                          <Icon className={`h-6 w-6 text-${integration.color}-600 dark:text-${integration.color}-400`} />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          integration.status === 'Connected' 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {integration.status}
                        </span>
                      </div>
                      <h5 className="font-semibold text-slate-900 dark:text-white mb-2">
                        {integration.name}
                      </h5>
                      <div className="flex space-x-2">
                        <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                          Configure
                        </button>
                        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 text-sm font-medium">
                          Test
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
