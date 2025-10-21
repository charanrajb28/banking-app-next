// src/hooks/useBudgets.ts
'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { GET_BUDGETS } from '@/graphql/queries';
import { CREATE_BUDGET, UPDATE_BUDGET, DELETE_BUDGET } from '@/graphql/mutations';
import { useCallback } from 'react';

interface Budget {
  id: string;
  user_id: string;
  category: string;
  budgeted_amount: number;
  spent_amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface CreateBudgetInput {
  category: string;
  budgeted_amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
}

export function useBudgets(status?: string) {
  const { data, loading, error, refetch } = useQuery<{ budgets: Budget[] }>(
    GET_BUDGETS,
    {
      variables: { status },
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    budgets: data?.budgets || [],
    loading,
    error,
    refetch,
  };
}

export function useCreateBudget() {
  const [createBudgetMutation, { loading, error, reset }] = useMutation<
    { createBudget: Budget },
    { input: CreateBudgetInput }
  >(CREATE_BUDGET, {
    refetchQueries: ['GetBudgets'],
    awaitRefetchQueries: true,
  });

  const createBudget = useCallback(
    async (input: CreateBudgetInput) => {
      const { data } = await createBudgetMutation({
        variables: { input },
      });
      return data?.createBudget;
    },
    [createBudgetMutation]
  );

  return {
    createBudget,
    loading,
    error,
    reset,
  };
}

export function useUpdateBudget() {
  const [updateBudgetMutation, { loading, error }] = useMutation<
    { updateBudget: Budget },
    { id: string; budgeted_amount?: number; status?: string }
  >(UPDATE_BUDGET, {
    refetchQueries: ['GetBudgets'],
  });

  const updateBudget = useCallback(
    async (id: string, budgeted_amount?: number, status?: string) => {
      const { data } = await updateBudgetMutation({
        variables: { id, budgeted_amount, status },
      });
      return data?.updateBudget;
    },
    [updateBudgetMutation]
  );

  return {
    updateBudget,
    loading,
    error,
  };
}

export function useDeleteBudget() {
  const [deleteBudgetMutation, { loading, error }] = useMutation<
    { deleteBudget: boolean },
    { id: string }
  >(DELETE_BUDGET, {
    refetchQueries: ['GetBudgets'],
  });

  const deleteBudget = useCallback(
    async (id: string) => {
      const { data } = await deleteBudgetMutation({
        variables: { id },
      });
      return data?.deleteBudget;
    },
    [deleteBudgetMutation]
  );

  return {
    deleteBudget,
    loading,
    error,
  };
}
