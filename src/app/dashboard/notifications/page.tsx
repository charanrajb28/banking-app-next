// src/app/dashboard/notifications/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import NotificationItem from '@/components/notifications/NotificationItem';
// import NotificationFilters from '@/components/notifications/NotificationFilters';
import { 
  Bell, 
  BellOff, 
  Settings, 
  Filter,
  Check,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp
} from 'lucide-react';

// src/types.ts or top of page.tsx
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  icon: string;
  actionUrl: string | null;
}

// src/app/dashboard/notifications/page.tsx

// ... (import statements)

// Assuming Notification type is defined
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'transaction',
    title: 'Payment Received',
    message: 'You received $2,500.00 from Tech Corp Inc.',
    timestamp: '2025-10-13T14:30:00',
    read: false,
    category: 'transaction',
    priority: 'medium',
    icon: '💰',
    actionUrl: '/dashboard/transactions'
  },
  {
    id: '2',
    type: 'security',
    title: 'New Device Login',
    message: 'New login detected from Chrome on Windows in New York, NY.',
    timestamp: '2025-10-13T12:15:00',
    read: false,
    category: 'security',
    priority: 'high',
    icon: '🔐',
    actionUrl: '/dashboard/security/devices'
  },
  {
    id: '3',
    type: 'budget',
    title: 'Budget Alert',
    message: 'You\'ve spent 85% of your shopping budget this month.',
    timestamp: '2025-10-13T09:45:00',
    read: true,
    category: 'budget',
    priority: 'medium',
    icon: '📊',
    actionUrl: '/dashboard/analytics'
  },
  {
    id: '4',
    type: 'goal',
    title: 'Goal Achievement',
    message: 'Congratulations! You\'ve reached 65% of your Emergency Fund goal.',
    timestamp: '2025-10-12T16:20:00',
    read: true,
    category: 'achievement',
    priority: 'low',
    icon: '🎯',
    actionUrl: '/dashboard/analytics'
  },
  {
    id: '5',
    type: 'card',
    title: 'Card Transaction',
    message: 'Your Virtual Card was used for $89.99 at Amazon.com.',
    timestamp: '2025-10-12T11:30:00',
    read: true,
    category: 'transaction',
    priority: 'low',
    icon: '💳',
    actionUrl: '/dashboard/cards'
  },
  {
    id: '6',
    type: 'system',
    title: 'Maintenance Notice',
    message: 'Scheduled maintenance on Oct 15, 2025 from 2:00 AM - 4:00 AM EST.',
    timestamp: '2025-10-11T10:00:00',
    read: true,
    category: 'system',
    priority: 'low',
    icon: '🔧',
    actionUrl: null
  },
  {
    id: '7',
    type: 'fraud',
    title: 'Suspicious Activity Blocked',
    message: 'We blocked a suspicious transaction of $1,250.00. Your account is secure.',
    timestamp: '2025-10-10T22:45:00',
    read: false,
    category: 'security',
    priority: 'high',
    icon: '🛡️',
    actionUrl: '/dashboard/security/activity'
  },
  {
    id: '8',
    type: 'investment',
    title: 'Market Update',
    message: 'Your investment portfolio is up 3.2% this week (+$1,440).',
    timestamp: '2025-10-10T08:00:00',
    read: true,
    category: 'investment',
    priority: 'low',
    icon: '📈',
    actionUrl: '/dashboard/investments'
  }
];

// ... (rest of the component)


const notificationCategories = [
  { id: 'all', name: 'All', count: mockNotifications.length },
  { id: 'transaction', name: 'Transactions', count: 2 },
  { id: 'security', name: 'Security', count: 2 },
  { id: 'budget', name: 'Budget', count: 1 },
  { id: 'achievement', name: 'Goals', count: 1 },
  { id: 'system', name: 'System', count: 1 },
  { id: 'investment', name: 'Investments', count: 1 }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
    const matchesReadStatus = !showUnreadOnly || !notification.read;
    return matchesCategory && matchesReadStatus;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
    setSelectedNotifications([]);
  };

  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedNotifications(filteredNotifications.map(n => n.id));
  };

  const clearSelection = () => {
    setSelectedNotifications([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Stay updated with your account activity and alerts
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-sm font-medium rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`flex items-center px-4 py-2 rounded-xl transition-colors ${
              showUnreadOnly
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {showUnreadOnly ? <Bell className="h-4 w-4 mr-2" /> : <BellOff className="h-4 w-4 mr-2" />}
            {showUnreadOnly ? 'Unread Only' : 'Show All'}
          </button>
          <button className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      {(unreadCount > 0 || selectedNotifications.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {selectedNotifications.length > 0 ? (
                <>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {selectedNotifications.length} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear
                  </button>
                </>
              ) : (
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Quick Actions
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedNotifications.length === 0 ? (
                <>
                  <button
                    onClick={selectAll}
                    className="flex items-center px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    Select All
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Mark All Read
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={deleteSelected}
                  className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Selected
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filter by Category</h3>
          <Filter className="h-5 w-5 text-slate-400" />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {notificationCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {category.name}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                selectedCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {selectedCategory === 'all' ? 'All Notifications' : `${notificationCategories.find(c => c.id === selectedCategory)?.name} Notifications`}
            <span className="ml-2 text-slate-500 dark:text-slate-400">
              ({filteredNotifications.length})
            </span>
          </h3>
        </div>

        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredNotifications.map((notification, index) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                index={index}
                isSelected={selectedNotifications.includes(notification.id)}
                onToggleSelect={toggleSelectNotification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg">No notifications found</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              {showUnreadOnly ? 'No unread notifications' : 'Check back later for updates'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
