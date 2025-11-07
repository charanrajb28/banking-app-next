// src/components/notifications/NotificationItem.tsx - UPDATED
'use client';

import { motion } from 'framer-motion';
import { Check, Trash2, ArrowRight, Send, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  status: 'read' | 'unread';
  created_at: string;
  data?: any;
}

interface NotificationItemProps {
  notification: Notification;
  index: number;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationItem({
  notification,
  index,
  isSelected,
  onToggleSelect,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const [expanded, setExpanded] = useState(false);

  const getActionButton = () => {
    if (notification.type === 'payment_request') {
      return {
        label: 'Go to Transfer',
        href: `/dashboard/transactions/transfer?to=${notification.data?.requesterId}`,
        icon: Send
      };
    }
    if (notification.type === 'transfer') {
      return {
        label: 'View Transaction',
        href: '/dashboard/transactions',
        icon: ArrowRight
      };
    }
    return null;
  };

  const action = getActionButton();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const isMoneyReceived = notification.data?.transactionType === 'transfer_in';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => {
        if (notification.status === 'unread') {
          onMarkAsRead(notification.id);
        }
      }}
      className={`p-6 border-b transition-all cursor-pointer hover:bg-opacity-50`}
      style={{
        borderColor: 'var(--card-bg-alt)',
        backgroundColor: notification.status === 'unread' ? 'var(--card-bg-alt)' : 'transparent'
      }}
    >
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(notification.id)}
          onClick={(e) => e.stopPropagation()}
          className="w-5 h-5 rounded border-2 mt-1 cursor-pointer"
        />

        {/* Icon */}
        <div className={`p-3 rounded-lg flex-shrink-0 ${
          isMoneyReceived 
            ? 'bg-green-100' 
            : notification.type === 'payment_request'
            ? 'bg-blue-100'
            : 'bg-gray-100'
        }`}>
          {isMoneyReceived ? (
            <TrendingDown className="h-5 w-5 text-green-600" />
          ) : notification.type === 'payment_request' ? (
            <Send className="h-5 w-5 text-blue-600" />
          ) : (
            <TrendingUp className="h-5 w-5 text-gray-600" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold" style={{ color: 'var(--card-text)' }}>
                {notification.title}
              </h4>
              <p className="text-sm mt-1" style={{ color: 'var(--card-text-secondary)' }}>
                {notification.message}
              </p>
            </div>
            {notification.status === 'unread' && (
              <div className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0 ml-2 mt-1"></div>
            )}
          </div>

          {/* Timestamp */}
          <p className="text-xs mt-2" style={{ color: 'var(--card-text-secondary)' }}>
            {formatDate(notification.created_at)}
          </p>

          {/* Detailed Info for Transfer */}
          {notification.type === 'transfer' && notification.data && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 rounded-lg"
              style={{ backgroundColor: 'var(--card-bg)' }}
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--card-text-secondary)' }}>Amount:</span>
                  <span className="font-semibold" style={{ color: 'var(--card-text)' }}>
                    ${notification.data.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--card-text-secondary)' }}>Transaction ID:</span>
                  <span className="font-mono text-xs" style={{ color: 'var(--card-text)' }}>
                    {notification.data.transactionId?.slice(-8)}
                  </span>
                </div>
                {isMoneyReceived && notification.data.senderName && (
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--card-text-secondary)' }}>From:</span>
                    <span style={{ color: 'var(--card-text)' }}>
                      {notification.data.senderName}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          {action && (
            <div className="mt-3 flex items-center space-x-2">
              <Link href={action.href}>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <action.icon className="h-4 w-4 mr-1" />
                  {action.label}
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}
