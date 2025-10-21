// src/hooks/useSecurity.ts
'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { GET_SECURITY_LOGS, GET_DEVICES } from '@/graphql/queries';
import { ENABLE_TWO_FACTOR, DISABLE_TWO_FACTOR, REMOVE_DEVICE, CHANGE_PASSWORD } from '@/graphql/mutations';
import { useCallback } from 'react';

interface SecurityLog {
  id: string;
  event_type: string;
  ip_address?: string;
  location?: string;
  success: boolean;
  created_at: string;
}

interface Device {
  id: string;
  device_name: string;
  device_type?: string;
  browser?: string;
  os?: string;
  ip_address?: string;
  location?: string;
  is_current: boolean;
  last_used: string;
  trusted: boolean;
  created_at: string;
}

export function useSecurityLogs(limit = 20) {
  const { data, loading, error } = useQuery<{ securityLogs: SecurityLog[] }>(
    GET_SECURITY_LOGS,
    {
      variables: { limit },
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    securityLogs: data?.securityLogs || [],
    loading,
    error,
  };
}

export function useDevices() {
  const { data, loading, error, refetch } = useQuery<{ devices: Device[] }>(
    GET_DEVICES,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    devices: data?.devices || [],
    loading,
    error,
    refetch,
  };
}

export function useEnableTwoFactor() {
  const [enableTwoFactorMutation, { loading, error }] = useMutation<{ enableTwoFactor: boolean }>(
    ENABLE_TWO_FACTOR
  );

  const enableTwoFactor = useCallback(async () => {
    const { data } = await enableTwoFactorMutation();
    return data?.enableTwoFactor;
  }, [enableTwoFactorMutation]);

  return {
    enableTwoFactor,
    loading,
    error,
  };
}

export function useDisableTwoFactor() {
  const [disableTwoFactorMutation, { loading, error }] = useMutation<{ disableTwoFactor: boolean }>(
    DISABLE_TWO_FACTOR
  );

  const disableTwoFactor = useCallback(async () => {
    const { data } = await disableTwoFactorMutation();
    return data?.disableTwoFactor;
  }, [disableTwoFactorMutation]);

  return {
    disableTwoFactor,
    loading,
    error,
  };
}

export function useRemoveDevice() {
  const [removeDeviceMutation, { loading, error }] = useMutation<
    { removeDevice: boolean },
    { id: string }
  >(REMOVE_DEVICE, {
    refetchQueries: ['GetDevices'],
  });

  const removeDevice = useCallback(
    async (id: string) => {
      const { data } = await removeDeviceMutation({
        variables: { id },
      });
      return data?.removeDevice;
    },
    [removeDeviceMutation]
  );

  return {
    removeDevice,
    loading,
    error,
  };
}

export function useChangePassword() {
  const [changePasswordMutation, { loading, error }] = useMutation<
    { changePassword: boolean },
    { current_password: string; new_password: string }
  >(CHANGE_PASSWORD);

  const changePassword = useCallback(
    async (current_password: string, new_password: string) => {
      const { data } = await changePasswordMutation({
        variables: { current_password, new_password },
      });
      return data?.changePassword;
    },
    [changePasswordMutation]
  );

  return {
    changePassword,
    loading,
    error,
  };
}
