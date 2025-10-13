// src/components/security/SecurityLog.tsx
'use client';

import { motion } from 'framer-motion';
import { Key, User, Shield, AlertTriangle, CheckCircle, Clock, Globe } from 'lucide-react';

const activityLog = [
  { id: '1', event: 'Successful Login', type: 'success', description: 'Logged in from Chrome on Windows', ip: '192.168.1.101', timestamp: '2025-10-13T18:05:00' },
  { id: '2', event: '2FA Enabled', type: 'success', description: 'Two-Factor Authentication was enabled', ip: '192.168.1.101', timestamp: '2025-10-13T18:02:00' },
  { id: '3', event: 'Failed Login Attempt', type: 'warning', description: 'Incorrect password entered', ip: '203.0.113.45', timestamp: '2025-10-13T17:50:00' },
  { id: '4', event: 'Password Changed', type: 'info', description: 'Password was successfully changed', ip: '172.16.0.10', timestamp: '2025-10-11T11:30:00' },
  { id: '5', event: 'New Device Added', type: 'info', description: 'iPhone 15 Pro was added to trusted devices', ip: '172.16.0.10', timestamp: '2025-10-11T11:28:00' }
];

export default function SecurityLog() {
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Shield className="h-5 w-5 text-blue-500" />;
      default: return <User className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        Security Activity Log
      </h3>
      <p className="text-slate-600 dark:text-slate-400">
        Review recent security-related activities on your account.
      </p>

      <div className="space-y-4">
        {activityLog.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl"
          >
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                {getEventIcon(log.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-slate-900 dark:text-white">{log.event}</h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{log.description}</p>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <Globe className="h-3 w-3 mr-1" />
                  IP Address: {log.ip}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600">
        Load More Activity
      </button>
    </div>
  );
}
