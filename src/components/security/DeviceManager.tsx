// src/components/security/DeviceManager.tsx
'use client';

import { motion } from 'framer-motion';
import { Smartphone, Monitor, Globe, LogOut, CheckCircle, MapPin } from 'lucide-react';

const devices = [
  { id: '1', type: 'desktop', name: 'Chrome on Windows', location: 'New York, NY', ip: '192.168.1.101', lastSeen: '2 minutes ago', isCurrent: true },
  { id: '2', type: 'mobile', name: 'iPhone 15 Pro', location: 'New York, NY', ip: '172.16.0.10', lastSeen: '3 hours ago', isCurrent: false },
  { id: '3', type: 'desktop', name: 'Safari on macOS', location: 'Brooklyn, NY', ip: '10.0.0.5', lastSeen: '2 days ago', isCurrent: false }
];

export default function DeviceManager() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        Device Management
      </h3>
      <p className="text-slate-600 dark:text-slate-400">
        You are signed in on these devices. You can sign out from any device you no longer use.
      </p>

      <div className="space-y-4">
        {devices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  {device.type === 'desktop' ? <Monitor className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">{device.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {device.location}
                    </span>
                    <span className="flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      {device.ip}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-0 text-right">
                {device.isCurrent ? (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Current device</span>
                  </div>
                ) : (
                  <button className="flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 text-sm font-medium">
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign out
                  </button>
                )}
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{device.lastSeen}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full py-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30">
        Sign out from all other devices
      </button>
    </div>
  );
}
