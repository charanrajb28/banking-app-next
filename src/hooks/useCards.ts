// src/hooks/useCards.ts
'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { GET_CARDS, GET_CARD_TRANSACTIONS } from '@/graphql/queries';
import { CREATE_CARD, UPDATE_CARD_STATUS, UPDATE_CARD_LIMITS } from '@/graphql/mutations';
import { useCallback } from 'react';

interface Card {
  id: string;
  card_number: string;
  card_type: 'virtual' | 'physical';
  card_name: string;
  card_brand?: string;
  expiry_date: string;
  status: 'active' | 'frozen' | 'blocked' | 'expired';
  daily_limit?: number | null;
  monthly_limit?: number | null;
  settings?: Record<string, any>;
  created_at: string;
}

interface CardTransaction {
  id: string;
  merchant_name: string;
  merchant_category?: string;
  merchant_location?: string;
  created_at: string;
  transaction: {
    id: string;
    amount: number;
    status: string;
    description?: string;
  };
}

interface CreateCardInput {
  account_id: string;
  card_type: 'virtual' | 'physical';
  card_name: string;
  card_brand: string;
  daily_limit?: number;
  monthly_limit?: number;
}

export function useCards() {
  const { data, loading, error, refetch } = useQuery<{ cards: Card[] }>(
    GET_CARDS,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    cards: data?.cards || [],
    loading,
    error,
    refetch,
  };
}

export function useCardTransactions(cardId: string, limit = 10) {
  const { data, loading, error } = useQuery<{
    cardTransactions: CardTransaction[];
  }>(GET_CARD_TRANSACTIONS, {
    variables: { cardId, limit },
    skip: !cardId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    transactions: data?.cardTransactions || [],
    loading,
    error,
  };
}

export function useCreateCard() {
  const [createCardMutation, { loading, error, reset }] = useMutation<
    { createCard: Card },
    { input: CreateCardInput }
  >(CREATE_CARD, {
    refetchQueries: ['GetCards'],
    awaitRefetchQueries: true,
  });

  const createCard = useCallback(
    async (input: CreateCardInput) => {
      const { data } = await createCardMutation({
        variables: { input },
      });
      return data?.createCard;
    },
    [createCardMutation]
  );

  return {
    createCard,
    loading,
    error,
    reset,
  };
}

export function useUpdateCardStatus() {
  const [updateCardStatusMutation, { loading, error }] = useMutation<
    { updateCardStatus: Card },
    { id: string; status: string }
  >(UPDATE_CARD_STATUS, {
    refetchQueries: ['GetCards'],
  });

  const updateCardStatus = useCallback(
    async (id: string, status: string) => {
      const { data } = await updateCardStatusMutation({
        variables: { id, status },
      });
      return data?.updateCardStatus;
    },
    [updateCardStatusMutation]
  );

  return {
    updateCardStatus,
    loading,
    error,
  };
}

export function useUpdateCardLimits() {
  const [updateCardLimitsMutation, { loading, error }] = useMutation<
    { updateCardLimits: Card },
    { id: string; daily_limit?: number; monthly_limit?: number }
  >(UPDATE_CARD_LIMITS, {
    refetchQueries: ['GetCards'],
  });

  const updateCardLimits = useCallback(
    async (id: string, daily_limit?: number, monthly_limit?: number) => {
      const { data } = await updateCardLimitsMutation({
        variables: { id, daily_limit, monthly_limit },
      });
      return data?.updateCardLimits;
    },
    [updateCardLimitsMutation]
  );

  return {
    updateCardLimits,
    loading,
    error,
  };
}
