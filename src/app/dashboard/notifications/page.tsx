// src/app/dashboard/notifications/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import NotificationItem from '@/components/notifications/NotificationItem';
import { 
  Bell, 
  BellOff, 
  Settings, 
  Filter,
  Check,
  Trash2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  status: 'read' | 'unread';
  created_at: string;
  data?: {
    requesterId?: string;
    requesterName?: string;
    amount?: string;
    description?: string;
    [key: string]: any;
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // src/app/dashboard/notifications/page.tsx - ADD THIS AT TOP FOR DEBUGGING

const fetchNotifications = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('Please login to view notifications');
    }

    const response = await fetch('/api/notifications', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Notifications response:', data);

    if (response.ok) {
      setNotifications(data.notifications || []);
      setError('');
    } else {
      throw new Error(data.error || 'Failed to fetch notifications');
    }
  } catch (err: any) {
    console.error('Error fetching notifications:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'read' }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, status: 'read' } : n)
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const unreadIds = notifications.filter(n => n.status === 'unread').map(n => n.id);

      for (const id of unreadIds) {
        await fetch(`/api/notifications/${id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'read' }),
        });
      }

      setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const deleteSelected = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      for (const id of selectedNotifications) {
        await fetch(`/api/notifications/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
      setSelectedNotifications([]);
    } catch (err) {
      console.error('Error deleting selected:', err);
    }
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

  // Get category from notification type
  const getNotificationCategory = (type: string): string => {
    if (type === 'payment_request') return 'request';
    if (type === 'transfer') return 'transaction';
    return type;
  };

  const notificationCategories = [
    { id: 'all', name: 'All', count: notifications.length },
    { id: 'request', name: 'Requests', count: notifications.filter(n => n.type === 'payment_request').length },
    { id: 'transaction', name: 'Transactions', count: notifications.filter(n => n.type === 'transfer').length },
    { id: 'alert', name: 'Alerts', count: notifications.filter(n => n.type === 'alert').length },
  ];

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const filteredNotifications = notifications.filter(notification => {
    const category = getNotificationCategory(notification.type);
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
    const matchesReadStatus = !showUnreadOnly || notification.status === 'unread';
    return matchesCategory && matchesReadStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: 'var(--card-text)' }} />
          <p style={{ color: 'var(--card-text-secondary)' }}>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>
            Notifications
          </h1>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mt-1">
            Stay updated with your account activity and alerts
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full inline-block">
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
                : ''
            }`}
            style={{
              backgroundColor: showUnreadOnly ? undefined : 'var(--card-bg-alt)',
              color: showUnreadOnly ? undefined : 'var(--card-text)'
            }}
          >
            {showUnreadOnly ? <Bell className="h-4 w-4 mr-2" /> : <BellOff className="h-4 w-4 mr-2" />}
            {showUnreadOnly ? 'Unread Only' : 'Show All'}
          </button>
          <button
            onClick={fetchNotifications}
            className="flex items-center px-4 py-2 rounded-xl transition-colors"
            style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      {(unreadCount > 0 || selectedNotifications.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {selectedNotifications.length > 0 ? (
                <>
                  <span className="text-sm font-medium" style={{ color: 'var(--card-text)' }}>
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
                <span className="text-sm font-medium" style={{ color: 'var(--card-text)' }}>
                  Quick Actions
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {selectedNotifications.length === 0 ? (
                <>
                  <button
                    onClick={selectAll}
                    className="flex items-center px-3 py-1 text-sm"
                    style={{ color: 'var(--card-text-secondary)' }}
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
      <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--card-text)' }}>
            Filter by Category
          </h3>
          <Filter className="h-5 w-5" style={{ color: 'var(--card-text-secondary)' }} />
        </div>

        <div className="flex flex-wrap gap-2">
          {notificationCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : ''
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? undefined : 'var(--card-bg-alt)',
                color: selectedCategory === category.id ? undefined : 'var(--card-text)'
              }}
            >
              {category.name}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                selectedCategory === category.id
                  ? 'bg-white/20 text-white'
                  : ''
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? undefined : 'var(--card-text-secondary)20',
                color: selectedCategory === category.id ? undefined : 'var(--card-text-secondary)'
              }}
              >
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--card-bg-alt)' }}>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--card-text)' }}>
            {selectedCategory === 'all' ? 'All Notifications' : `${notificationCategories.find(c => c.id === selectedCategory)?.name} Notifications`}
            <span style={{ color: 'var(--card-text-secondary)' }} className="ml-2">
              ({filteredNotifications.length})
            </span>
          </h3>
        </div>

        {filteredNotifications.length > 0 ? (
          <div>
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
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <Bell className="h-8 w-8" style={{ color: 'var(--card-text-secondary)' }} />
            </div>
            <p className="text-lg" style={{ color: 'var(--card-text)' }}>No notifications found</p>
            <p className="text-sm mt-1" style={{ color: 'var(--card-text-secondary)' }}>
              {showUnreadOnly ? 'No unread notifications' : 'Check back later for updates'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
