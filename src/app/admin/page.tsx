// src/app/admin/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  TrendingUp, 
  FileText, 
  ShieldCheck,
  Bell,
  Settings,
  UserPlus,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminReports from '@/components/admin/AdminReports';
import AdminTransactions from '@/components/admin/AdminTransactions';
import AdminSettings from '@/components/admin/AdminSettings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const adminStats = {
    totalUsers: 12847,
    activeToday: 4231,
    pendingApprovals: 12,
    flaggedTransactions: 8,
    systemAlerts: 3,
    newAccounts: 87
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'transactions', name: 'Transactions', icon: CreditCard },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const ActiveComponent = () => {
    switch(activeTab) {
      case 'users': return <AdminUsers />;
      case 'transactions': return <AdminTransactions />;
      case 'reports': return <AdminReports />;
      case 'settings': return <AdminSettings />;
      default: return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 shadow-lg z-50">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Bank Admin</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Administrator</p>
            </div>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {tabs.find(t => t.id === activeTab)?.name}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {activeTab === 'dashboard' ? 'Overview of all system metrics and alerts' : 
               activeTab === 'users' ? 'Manage and monitor all user accounts' :
               activeTab === 'transactions' ? 'Monitor all financial transactions' :
               activeTab === 'reports' ? 'Generate financial and compliance reports' :
               'Configure system settings and preferences'}
            </p>
          </div>
          
          {activeTab === 'users' && (
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </button>
          )}
        </div>

        {/* Dashboard Content */}
        <ActiveComponent />
      </div>
    </div>
  );
}

// Dashboard Content Component
function DashboardContent() {
  const adminStats = {
    totalUsers: 12847,
    activeToday: 4231,
    pendingApprovals: 12,
    flaggedTransactions: 8,
    systemAlerts: 3,
    newAccounts: 87
  };

  const metrics = [
    {
      name: 'Total Users',
      value: adminStats.totalUsers.toLocaleString(),
      change: '+12.5%',
      Icon: Users,
      color: 'from-blue-600 to-blue-700'
    },
    {
      name: 'Active Today',
      value: adminStats.activeToday.toLocaleString(),
      change: '+8.2%',
      Icon: DollarSign,
      color: 'from-green-600 to-green-700'
    },
    {
      name: 'Pending Approvals',
      value: adminStats.pendingApprovals,
      change: '-3.1%',
      Icon: AlertTriangle,
      color: 'from-yellow-600 to-yellow-700'
    },
    {
      name: 'Flagged Transactions',
      value: adminStats.flaggedTransactions,
      change: '+2.4%',
      Icon: AlertTriangle,
      color: 'from-red-600 to-red-700'
    },
    {
      name: 'New Accounts',
      value: adminStats.newAccounts,
      change: '+15.7%',
      Icon: UserPlus,
      color: 'from-purple-600 to-purple-700'
    },
    {
      name: 'System Alerts',
      value: adminStats.systemAlerts,
      change: 'No change',
      Icon: Bell,
      color: 'from-orange-600 to-orange-700'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.Icon;
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{metric.name}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                    {metric.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm ${
                      metric.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 
                      metric.change.startsWith('-') ? 'text-red-600 dark:text-red-400' : 
                      'text-slate-500 dark:text-slate-400'
                    }`}>
                      {metric.change.startsWith('+') && '↑ '}
                      {metric.change.startsWith('-') && '↓ '}
                      {metric.change}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">vs last week</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">System Status</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-slate-900 dark:text-white">API Services</span>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-slate-900 dark:text-white">Database</span>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-slate-900 dark:text-white">Email Service</span>
              </div>
              <span className="text-sm text-yellow-600 dark:text-yellow-400">Degraded</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium text-slate-900 dark:text-white">SMS Gateway</span>
              </div>
              <span className="text-sm text-red-600 dark:text-red-400">Down</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Alerts</h3>
          
          <div className="space-y-3">
            {[
              { type: 'warning', message: 'High transaction volume detected in Northeast region', time: '10 minutes ago' },
              { type: 'danger', message: 'Suspicious login attempts from IP 192.168.1.100', time: '25 minutes ago' },
              { type: 'info', message: 'Database backup completed successfully', time: '1 hour ago' },
              { type: 'success', message: 'SSL certificate renewal completed', time: '2 hours ago' }
            ].map((alert, index) => (
              <div key={index} className={`p-3 rounded-xl border-l-4 ${
                alert.type === 'danger' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                alert.type === 'info' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' :
                'bg-green-50 dark:bg-green-900/20 border-green-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{alert.message}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{alert.time}</p>
                  </div>
                  <button className="ml-2 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                    <Settings className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-3">
              <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-medium text-slate-900 dark:text-white">Add User</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Create new account</span>
          </button>

          <button className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-3">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="font-medium text-slate-900 dark:text-white">Export Data</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">CSV/Excel reports</span>
          </button>

          <button className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center mb-3">
              <ShieldCheck className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="font-medium text-slate-900 dark:text-white">Security Audit</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Run compliance check</span>
          </button>

          <button className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center mb-3">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <span className="font-medium text-slate-900 dark:text-white">Incident Report</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Log security event</span>
          </button>
        </div>
      </div>
    </div>
  );
}
