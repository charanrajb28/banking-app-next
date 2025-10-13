// src/components/admin/AdminUsers.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  User, 
  Shield, 
  Clock,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  MoreVertical,
  Ban,
  Check,
  X
} from 'lucide-react';

// Mock data
const users = [
  { id: '1', name: 'John Smith', email: 'john.s@domain.com', status: 'active', role: 'customer', lastLogin: '2025-10-13T14:30:00', accountAge: 730, riskLevel: 'low', twoFactor: true },
  { id: '2', name: 'Sarah Wilson', email: 'sarah.w@domain.com', status: 'active', role: 'customer', lastLogin: '2025-10-13T12:15:00', accountAge: 145, riskLevel: 'medium', twoFactor: true },
  { id: '3', name: 'Michael Johnson', email: 'michael.j@domain.com', status: 'suspended', role: 'customer', lastLogin: '2025-10-12T09:45:00', accountAge: 89, riskLevel: 'high', twoFactor: false },
  { id: '4', name: 'Emily Davis', email: 'emily.d@domain.com', status: 'active', role: 'customer', lastLogin: '2025-10-13T08:00:00', accountAge: 320, riskLevel: 'low', twoFactor: true },
  { id: '5', name: 'Robert Brown', email: 'robert.b@domain.com', status: 'active', role: 'merchant', lastLogin: '2025-10-13T16:20:00', accountAge: 1050, riskLevel: 'low', twoFactor: true },
  { id: '6', name: 'Jennifer Taylor', email: 'jennifer.t@domain.com', status: 'pending', role: 'customer', lastLogin: null, accountAge: 2, riskLevel: 'medium', twoFactor: false },
  { id: '7', name: 'David Martinez', email: 'david.m@domain.com', status: 'active', role: 'customer', lastLogin: '2025-10-12T20:45:00', accountAge: 45, riskLevel: 'high', twoFactor: false },
  { id: '8', name: 'Lisa Anderson', email: 'lisa.a@domain.com', status: 'active', role: 'advisor', lastLogin: '2025-10-13T11:30:00', accountAge: 580, riskLevel: 'low', twoFactor: true }
];

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const formatAccountAge = (days: number) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
    if (days >= 30) {
      const months = Math.floor(days / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  const formatTimeAgo = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const loginTime = new Date(timestamp);
    const diffTime = Math.abs(now.getTime() - loginTime.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'suspended': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || user.riskLevel === riskFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRisk && matchesRole;
  });

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAll = () => {
    setSelectedUsers(filteredUsers.map(u => u.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const showUserDetails = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">User Management</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Monitor and manage all user accounts and permissions
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
              />
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="flex space-x-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>

            <select 
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>

            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="merchant">Merchant</option>
              <option value="advisor">Advisor</option>
            </select>

            <button className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {selectedUsers.length} selected
              </span>
              <button
                onClick={clearSelection}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                <Ban className="h-4 w-4 mr-1" />
                Suspend
              </button>
              <button className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                <Check className="h-4 w-4 mr-1" />
                Activate
              </button>
              <button className="flex items-center px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Review
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
              Users ({filteredUsers.length})
            </h4>
            <button
              onClick={selectAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Select All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    onChange={() => selectedUsers.length === filteredUsers.length ? clearSelection() : selectAll()}
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Account Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  2FA
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(user.riskLevel)}`}>
                      {user.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {formatTimeAgo(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {formatAccountAge(user.accountAge)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.twoFactor ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => showUserDetails(user)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button className="text-slate-400 hover:text-slate-600 ml-4">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
