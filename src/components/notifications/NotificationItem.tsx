// src/components/notifications/NotificationItem.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Check, 
  Trash2, 
  ExternalLink, 
  Clock,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

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
  onDelete
}: NotificationItemProps) {
  
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffTime = Math.abs(now.getTime() - notificationTime.getTime());
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 dark:border-red-800';
      case 'medium': return 'border-yellow-200 dark:border-yellow-800';
      case 'low': return 'border-slate-200 dark:border-slate-700';
      default: return 'border-slate-200 dark:border-slate-700';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Info className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      case 'transaction': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'budget': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'achievement': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'system': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      case 'investment': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer border-l-4 ${
        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
      } ${getPriorityColor(notification.priority)} ${
        isSelected ? 'bg-blue-100 dark:bg-blue-900/20' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Selection Checkbox */}
        <button
          onClick={() => onToggleSelect(notification.id)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            isSelected 
              ? 'bg-blue-600 border-blue-600' 
              : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
          }`}
        >
          {isSelected && <Check className="h-3 w-3 text-white" />}
        </button>

        {/* Notification Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-2xl">
            {notification.icon}
          </div>
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className={`font-semibold truncate ${
                  !notification.read 
                    ? 'text-slate-900 dark:text-white' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {notification.title}
                </h4>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(notification.category)}`}>
                  {notification.category}
                </span>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {notification.message}
              </p>
              
              <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTimeAgo(notification.timestamp)}
                </div>
                <div className="flex items-center">
                  {getPriorityIcon(notification.priority)}
                  <span className="ml-1 capitalize">{notification.priority} priority</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              {notification.actionUrl && (
                <Link 
                  href={notification.actionUrl}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  title="View Details"
                >
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </Link>
              )}
              
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  title="Mark as Read"
                >
                  <Check className="h-4 w-4 text-slate-400" />
                </button>
              )}
              
              <button
                onClick={() => onDelete(notification.id)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
