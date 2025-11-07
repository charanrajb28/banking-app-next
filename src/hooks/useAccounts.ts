// src/hooks/useTransactions.ts
'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { GET_TRANSACTIONS, GET_TRANSACTION } from '@/graphql/queries';
import { CREATE_TRANSACTION, CANCEL_TRANSACTION } from '@/graphql/mutations';
import { useCallback } from 'react';

interface Transaction {
  id: string;
  transaction_id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  category?: string;
  created_at: string;
}

interface TransactionFilter {
  status?: string;
  transaction_type?: string;
  category?: string;
}

interface CreateTransactionInput {
  from_account_id: string;
  to_account_id?: string;
  amount: number;
  transaction_type: string;
  description?: string;
  category?: string;
}

export function useTransactions(filter?: TransactionFilter, limit = 20, offset = 0) {
  const { data, loading, error, fetchMore, refetch } = useQuery<{
    transactions: Transaction[];
  }>(GET_TRANSACTIONS, {
    variables: { filter, limit, offset },
    fetchPolicy: 'cache-and-network',
  });

  const loadMore = useCallback(() => {
    if (data?.transactions && !loading) {
      return fetchMore({
        variables: {
          offset: data.transactions.length,
        },
      });
    }
  }, [data?.transactions, loading, fetchMore]);

  return {
    transactions: data?.transactions || [],
    loading,
    error,
    loadMore,
    refetch,
  };
}

export function useTransaction(id: string) {
  const { data, loading, error } = useQuery<{ transaction: Transaction }>(
    GET_TRANSACTION,
    {
      variables: { id },
      skip: !id,
    }
  );

  return {
    transaction: data?.transaction || null,
    loading,
    error,
  };
}

export function useCreateTransaction() {
  const [createTransactionMutation, { loading, error, reset }] = useMutation<
    { createTransaction: Transaction },
    { input: CreateTransactionInput }
  >(CREATE_TRANSACTION, {
    refetchQueries: ['GetTransactions', 'GetAccounts'],
    awaitRefetchQueries: true,
  });

  const createTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      const { data } = await createTransactionMutation({
        variables: { input },
      });
      return data?.createTransaction;
    },
    [createTransactionMutation]
  );

  return {
    createTransaction,
    loading,
    error,
    reset,
  };
}

export function useCancelTransaction() {
  const [cancelTransactionMutation, { loading, error }] = useMutation<
    { cancelTransaction: Transaction },
    { id: string }
  >(
    CANCEL_TRANSACTION,
    {
      refetchQueries: ['GetTransactions'],
    }
  );

  const cancelTransaction = useCallback(
    async (id: string) => {
      const { data } = await cancelTransactionMutation({
        variables: { id },
      });
      return data?.cancelTransaction;
    },
    [cancelTransactionMutation]
  );

  return {
    cancelTransaction,
    loading,
    error,
  };
}


