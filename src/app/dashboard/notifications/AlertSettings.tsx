// src/components/notifications/AlertSettings.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Smartphone, 
  Mail, 
  DollarSign, 
  Shield, 
  CreditCard,
  TrendingUp,
  Settings,
  Save,
  Volume2,
  VolumeX
} from 'lucide-react';

const notificationSettings = [
  {
    id: 'transactions',
    name: 'Transaction Alerts',
    description: 'Get notified when money moves in or out of your accounts',
    icon: DollarSign,
    color: 'green',
    settings: {
      email: true,
      sms: true,
      push: true,
      threshold: 50,
      enabled: true
    }
  },
  {
    id: 'security',
    name: 'Security Alerts',
    description: 'Important security notifications and login alerts',
    icon: Shield,
    color: 'red',
    settings: {
      email: true,
      sms: true,
      push: true,
      threshold: 0,
      enabled: true
    }
  },
  {
    id: 'cards',
    name: 'Card Notifications',
    description: 'Card transactions, limits, and security updates',
    icon: CreditCard,
    color: 'blue',
    settings: {
      email: true,
      sms: false,
      push: true,
      threshold: 25,
      enabled: true
    }
  },
  {
    id: 'budget',
    name: 'Budget & Goals',
    description: 'Budget alerts and goal achievement notifications',
    icon: TrendingUp,
    color: 'purple',
    settings: {
      email: true,
      sms: false,
      push: true,
      threshold: 0,
      enabled: true
    }
  },
  {
    id: 'marketing',
    name: 'Promotions & Updates',
    description: 'New features, offers, and product updates',
    icon: Bell,
    color: 'yellow',
    settings: {
      email: true,
      sms: false,
      push: false,
      threshold: 0,
      enabled: false
    }
  }
];

const quietHours = {
  enabled: true,
  startTime: '22:00',
  endTime: '08:00',
  weekendsOnly: false
};

export default function AlertSettings() {
  const [settings, setSettings] = useState(notificationSettings);
  const [quietHoursSettings, setQuietHoursSettings] = useState(quietHours);
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (categoryId: string, setting: string, value: any) => {
    setSettings(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, settings: { ...category.settings, [setting]: value } }
        : category
    ));
  };

  const handleQuietHoursChange = (setting: string, value: any) => {
    setQuietHoursSettings(prev => ({ ...prev, [setting]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message
    }, 1500);
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600 dark:text-green-400';
      case 'red': return 'text-red-600 dark:text-red-400';
      case 'blue': return 'text-blue-600 dark:text-blue-400';
      case 'purple': return 'text-purple-600 dark:text-purple-400';
      case 'yellow': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getBgColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 dark:bg-green-900/20';
      case 'red': return 'bg-red-100 dark:bg-red-900/20';
      case 'blue': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'purple': return 'bg-purple-100 dark:bg-purple-900/20';
      case 'yellow': return 'bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'bg-slate-100 dark:bg-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notification Settings</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Customize how and when you receive notifications
        </p>
      </div>

      {/* Notification Categories */}
      <div className="space-y-6">
        {settings.map((category, index) => {
          const IconComponent = category.icon;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${getBgColor(category.color)}`}>
                    <IconComponent className={`h-6 w-6 ${getIconColor(category.color)}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleSettingChange(category.id, 'enabled', !category.settings.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    category.settings.enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    category.settings.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {category.settings.enabled && (
                <div className="space-y-4">
                  {/* Delivery Methods */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      Delivery Methods
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
                        </div>
                        <button
                          onClick={() => handleSettingChange(category.id, 'email', !category.settings.email)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            category.settings.email ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            category.settings.email ? 'translate-x-5' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">SMS</span>
                        </div>
                        <button
                          onClick={() => handleSettingChange(category.id, 'sms', !category.settings.sms)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            category.settings.sms ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            category.settings.sms ? 'translate-x-5' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Push</span>
                        </div>
                        <button
                          onClick={() => handleSettingChange(category.id, 'push', !category.settings.push)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            category.settings.push ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            category.settings.push ? 'translate-x-5' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Threshold Settings */}
                  {(category.id === 'transactions' || category.id === 'cards') && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Minimum Amount Threshold
                      </h4>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-500 dark:text-slate-400">$</span>
                        <input
                          type="number"
                          min="0"
                          step="5"
                          value={category.settings.threshold}
                          onChange={(e) => handleSettingChange(category.id, 'threshold', parseInt(e.target.value) || 0)}
                          className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          Only notify for amounts above this threshold
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Quiet Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl">
              {quietHoursSettings.enabled ? (
                <VolumeX className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              ) : (
                <Volume2 className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Quiet Hours
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Pause non-urgent notifications during specified hours
              </p>
            </div>
          </div>
          
          <button
            onClick={() => handleQuietHoursChange('enabled', !quietHoursSettings.enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              quietHoursSettings.enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              quietHoursSettings.enabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {quietHoursSettings.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={quietHoursSettings.startTime}
                onChange={(e) => handleQuietHoursChange('startTime', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={quietHoursSettings.endTime}
                onChange={(e) => handleQuietHoursChange('endTime', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <motion.button
          onClick={saveSettings}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          {isSaving ? 'Saving...' : 'Save Settings'}
        </motion.button>
      </div>
    </div>
  );
}
