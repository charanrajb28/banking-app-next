// src/hooks/useAnalytics.ts
'use client';

import { useQuery } from '@apollo/client/react';
import { GET_SPENDING_ANALYTICS } from '@/graphql/queries';

interface MonthlyTrend {
  month: string;
  spending: number;
  income: number;
  savings: number;
}

interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

interface SpendingAnalytics {
  total_spent: number;
  total_income: number;
  savings_rate: number;
  top_category?: string;
  monthly_trend: MonthlyTrend[];
  category_breakdown: CategoryBreakdown[];
}

export function useSpendingAnalytics(startDate?: string, endDate?: string) {
  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery<{
    spendingAnalytics: SpendingAnalytics;
  }>(GET_SPENDING_ANALYTICS, {
    variables: { startDate, endDate },
    fetchPolicy: 'cache-and-network',
    pollInterval: 5 * 60 * 1000,
  });

  return {
    analytics: data?.spendingAnalytics || null,
    loading,
    error,
    refetch,
    startPolling,
    stopPolling,
  };
}
