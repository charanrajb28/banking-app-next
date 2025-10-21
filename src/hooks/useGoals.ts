// src/hooks/useGoals.ts
'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { GET_GOALS } from '@/graphql/queries';
import { CREATE_GOAL, UPDATE_GOAL, DELETE_GOAL } from '@/graphql/mutations';
import { useCallback } from 'react';

interface FinancialGoal {
  id: string;
  user_id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'in_progress' | 'completed' | 'cancelled';
  icon?: string;
  created_at: string;
  updated_at: string;
}

interface CreateGoalInput {
  goal_name: string;
  target_amount: number;
  deadline?: string;
  priority?: 'low' | 'medium' | 'high';
}

export function useGoals(status?: string) {
  const { data, loading, error, refetch } = useQuery<{ goals: FinancialGoal[] }>(
    GET_GOALS,
    {
      variables: { status },
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    goals: data?.goals || [],
    loading,
    error,
    refetch,
  };
}

export function useCreateGoal() {
  const [createGoalMutation, { loading, error, reset }] = useMutation<
    { createGoal: FinancialGoal },
    { input: CreateGoalInput }
  >(CREATE_GOAL, {
    refetchQueries: ['GetGoals'],
    awaitRefetchQueries: true,
  });

  const createGoal = useCallback(
    async (input: CreateGoalInput) => {
      const { data } = await createGoalMutation({
        variables: { input },
      });
      return data?.createGoal;
    },
    [createGoalMutation]
  );

  return {
    createGoal,
    loading,
    error,
    reset,
  };
}

export function useUpdateGoal() {
  const [updateGoalMutation, { loading, error }] = useMutation<
    { updateGoal: FinancialGoal },
    { id: string; current_amount?: number; status?: string }
  >(UPDATE_GOAL, {
    refetchQueries: ['GetGoals'],
  });

  const updateGoal = useCallback(
    async (id: string, current_amount?: number, status?: string) => {
      const { data } = await updateGoalMutation({
        variables: { id, current_amount, status },
      });
      return data?.updateGoal;
    },
    [updateGoalMutation]
  );

  return {
    updateGoal,
    loading,
    error,
  };
}

export function useDeleteGoal() {
  const [deleteGoalMutation, { loading, error }] = useMutation<
    { deleteGoal: boolean },
    { id: string }
  >(DELETE_GOAL, {
    refetchQueries: ['GetGoals'],
  });

  const deleteGoal = useCallback(
    async (id: string) => {
      const { data } = await deleteGoalMutation({
        variables: { id },
      });
      return data?.deleteGoal;
    },
    [deleteGoalMutation]
  );

  return {
    deleteGoal,
    loading,
    error,
  };
}
