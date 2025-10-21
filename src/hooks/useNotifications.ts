
// src/hooks/useNotifications.ts
'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { GET_NOTIFICATIONS, GET_UNREAD_COUNT } from '@/graphql/queries';
import {
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
  DELETE_NOTIFICATION,
} from '@/graphql/mutations';
import { useCallback } from 'react';

interface Notification {
  id: string;
  type: 'transaction' | 'security' | 'budget' | 'goal' | 'system' | 'marketing';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  category: string;
  icon?: string;
  action_url?: string;
  created_at: string;
}

export function useNotifications(read?: boolean, limit = 50) {
  const { data, loading, error, refetch } = useQuery<{
    notifications: Notification[];
  }>(GET_NOTIFICATIONS, {
    variables: { read, limit },
    fetchPolicy: 'cache-and-network',
  });

  return {
    notifications: data?.notifications || [],
    loading,
    error,
    refetch,
  };
}

export function useUnreadCount() {
  const { data, startPolling, stopPolling } = useQuery<{
    unreadNotificationCount: number;
  }>(GET_UNREAD_COUNT, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000,
  });

  return {
    count: data?.unreadNotificationCount || 0,
    startPolling,
    stopPolling,
  };
}

export function useMarkNotificationRead() {
  const [markReadMutation, { loading, error }] = useMutation<
    { markNotificationAsRead: Notification },
    { id: string }
  >(MARK_NOTIFICATION_READ, {
    refetchQueries: ['GetNotifications', 'GetUnreadCount'],
  });

  const markRead = useCallback(
    async (id: string) => {
      const { data } = await markReadMutation({
        variables: { id },
      });
      return data?.markNotificationAsRead;
    },
    [markReadMutation]
  );

  return {
    markRead,
    loading,
    error,
  };
}

export function useMarkAllRead() {
  const [markAllReadMutation, { loading, error }] = useMutation<
    { markAllNotificationsAsRead: boolean }
  >(MARK_ALL_NOTIFICATIONS_READ, {
    refetchQueries: ['GetNotifications', 'GetUnreadCount'],
    awaitRefetchQueries: true,
  });

  const markAllRead = useCallback(async () => {
    const { data } = await markAllReadMutation();
    return data?.markAllNotificationsAsRead;
  }, [markAllReadMutation]);

  return {
    markAllRead,
    loading,
    error,
  };
}

export function useDeleteNotification() {
  const [deleteNotificationMutation, { loading, error }] = useMutation<
    { deleteNotification: boolean },
    { id: string }
  >(DELETE_NOTIFICATION, {
    refetchQueries: ['GetNotifications', 'GetUnreadCount'],
  });

  const deleteNotification = useCallback(
    async (id: string) => {
      const { data } = await deleteNotificationMutation({
        variables: { id },
      });
      return data?.deleteNotification;
    },
    [deleteNotificationMutation]
  );

  return {
    deleteNotification,
    loading,
    error,
  };
}
