// src/graphql/resolvers.ts
import { supabaseAdmin } from '@/lib/supabase';
import { GraphQLError } from 'graphql';

interface Context {
  user: any;
}

export const resolvers = {
  // ============================================
  // QUERIES
  // ============================================
  Query: {
    // User queries
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', context.user.id)
        .single();

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    // Account queries
    accounts: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const { data, error } = await supabaseAdmin
        .from('accounts')
        .select('*')
        .eq('user_id', context.user.id)
        .order('created_at', { ascending: false });

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    account: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const { data, error } = await supabaseAdmin
        .from('accounts')
        .select('*')
        .eq('id', id)
        .eq('user_id', context.user.id)
        .single();

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    // Transaction queries
    transactions: async (
      _: any,
      { filter, limit = 20, offset = 0 }: any,
      context: Context
    ) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      let query = supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('user_id', context.user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (filter) {
        if (filter.status) query = query.eq('status', filter.status);
        if (filter.transaction_type) query = query.eq('transaction_type', filter.transaction_type);
        if (filter.category) query = query.eq('category', filter.category);
        if (filter.start_date) query = query.gte('created_at', filter.start_date);
        if (filter.end_date) query = query.lte('created_at', filter.end_date);
        if (filter.min_amount) query = query.gte('amount', filter.min_amount);
        if (filter.max_amount) query = query.lte('amount', filter.max_amount);
      }

      const { data, error } = await query;

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    transaction: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const { data, error } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('id', id)
        .eq('user_id', context.user.id)
        .single();

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    // Card queries
    cards: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const { data, error } = await supabaseAdmin
        .from('cards')
        .select('*')
        .eq('user_id', context.user.id)
        .order('created_at', { ascending: false });

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    // Budget queries
    budgets: async (_: any, { status }: { status?: string }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      let query = supabaseAdmin
        .from('budgets')
        .select('*')
        .eq('user_id', context.user.id);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    // Goals queries
    goals: async (_: any, { status }: { status?: string }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      let query = supabaseAdmin
        .from('financial_goals')
        .select('*')
        .eq('user_id', context.user.id);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    // Analytics queries
    spendingAnalytics: async (
      _: any,
      { start_date, end_date }: any,
      context: Context
    ) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Get transactions for the period
      let query = supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('user_id', context.user.id)
        .eq('status', 'completed');

      if (start_date) query = query.gte('created_at', start_date);
      if (end_date) query = query.lte('created_at', end_date);

      const { data: transactions, error } = await query;

      if (error) throw new GraphQLError(error.message);

      // Calculate analytics
      const total_spent = transactions
        .filter(t => ['withdrawal', 'transfer', 'card_payment'].includes(t.transaction_type))
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const total_income = transactions
        .filter(t => ['deposit', 'refund'].includes(t.transaction_type))
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const savings_rate = total_income > 0 
        ? ((total_income - total_spent) / total_income) * 100 
        : 0;

      // Category breakdown
      const categoryMap = new Map();
      transactions
        .filter(t => t.category)
        .forEach(t => {
          const current = categoryMap.get(t.category) || { amount: 0, count: 0 };
          categoryMap.set(t.category, {
            amount: current.amount + parseFloat(t.amount),
            count: current.count + 1,
          });
        });

      const category_breakdown = Array.from(categoryMap.entries()).map(([category, data]: any) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: (data.amount / total_spent) * 100,
      }));

      const top_category = category_breakdown.sort((a, b) => b.amount - a.amount)[0]?.category || null;

      // Monthly trend (last 6 months)
      const monthly_trend: any[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleString('default', { month: 'short' });
        
        const monthTransactions = transactions.filter(t => {
          const tDate = new Date(t.created_at);
          return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
        });

        const spending = monthTransactions
          .filter(t => ['withdrawal', 'transfer', 'card_payment'].includes(t.transaction_type))
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const income = monthTransactions
          .filter(t => ['deposit', 'refund'].includes(t.transaction_type))
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        monthly_trend.push({
          month,
          spending,
          income,
          savings: income - spending,
        });
      }

      return {
        total_spent,
        total_income,
        savings_rate,
        top_category,
        monthly_trend,
        category_breakdown,
      };
    },

    // Notification queries
    notifications: async (
      _: any,
      { read, limit = 50 }: any,
      context: Context
    ) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      let query = supabaseAdmin
        .from('notifications')
        .select('*')
        .eq('user_id', context.user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (read !== undefined) {
        query = query.eq('read', read);
      }

      const { data, error } = await query;

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    unreadNotificationCount: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const { count, error } = await supabaseAdmin
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', context.user.id)
        .eq('read', false);

      if (error) throw new GraphQLError(error.message);
      return count || 0;
    },

    // Security queries
    securityLogs: async (_: any, { limit = 20 }: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const { data, error } = await supabaseAdmin
        .from('security_logs')
        .select('*')
        .eq('user_id', context.user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    devices: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const { data, error } = await supabaseAdmin
        .from('devices')
        .select('*')
        .eq('user_id', context.user.id)
        .order('last_used', { ascending: false });

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    // Admin queries
    allUsers: async (
      _: any,
      { limit = 50, offset = 0 }: any,
      context: Context
    ) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Check if user is admin
      const { data: currentUser } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', context.user.id)
        .single();

      if (currentUser?.role !== 'admin') {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw new GraphQLError(error.message);
      return data;
    },
  },

  // ============================================
  // MUTATIONS
  // ============================================
  Mutation: {
    // Account mutations
    createAccount: async (_: any, { input }: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const accountNumber = `ACC${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`;

      const { data, error } = await supabaseAdmin
        .from('accounts')
        .insert({
          user_id: context.user.id,
          account_number: accountNumber,
          account_type: input.account_type,
          account_name: input.account_name,
          balance: input.initial_balance || 0,
        })
        .select()
        .single();

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    // Transaction mutations
    createTransaction: async (_: any, { input }: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Validate amount
      if (input.amount <= 0) {
        throw new GraphQLError('Invalid amount');
      }

      // Check balance
      const { data: fromAccount } = await supabaseAdmin
        .from('accounts')
        .select('balance')
        .eq('id', input.from_account_id)
        .single();

      if (fromAccount && fromAccount.balance < input.amount) {
        throw new GraphQLError('Insufficient balance');
      }

      // Generate transaction ID
      const transactionId = `TXN${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

      // Create transaction
      const { data, error } = await supabaseAdmin
        .from('transactions')
        .insert({
          transaction_id: transactionId,
          user_id: context.user.id,
          from_account_id: input.from_account_id,
          to_account_id: input.to_account_id,
          amount: input.amount,
          transaction_type: input.transaction_type,
          description: input.description,
          category: input.category,
          payment_method: input.payment_method,
          status: 'completed',
        })
        .select()
        .single();

      if (error) throw new GraphQLError(error.message);

      // Create notification
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: context.user.id,
          type: 'transaction',
          title: 'Transaction Successful',
          message: `${input.transaction_type} of $${input.amount} completed successfully`,
          category: 'transaction',
          priority: 'medium',
        });

      return data;
    },

    // Card mutations
    createCard: async (_: any, { input }: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const cardNumber = `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
      const cvv = Math.floor(100 + Math.random() * 900).toString();
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 3);

      const { data, error } = await supabaseAdmin
        .from('cards')
        .insert({
          user_id: context.user.id,
          account_id: input.account_id,
          card_number: cardNumber,
          card_type: input.card_type,
          card_name: input.card_name,
          card_brand: input.card_brand,
          cvv: cvv,
          expiry_date: expiryDate.toISOString().split('T')[0],
          card_holder_name: context.user.full_name || 'Card Holder',
          daily_limit: input.daily_limit || 1000,
          monthly_limit: input.monthly_limit || 5000,
        })
        .select()
        .single();

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    // Budget mutations
    createBudget: async (_: any, { input }: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const { data, error } = await supabaseAdmin
        .from('budgets')
        .insert({
          user_id: context.user.id,
          ...input,
        })
        .select()
        .single();

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    // Goal mutations
    createGoal: async (_: any, { input }: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const { data, error } = await supabaseAdmin
        .from('financial_goals')
        .insert({
          user_id: context.user.id,
          ...input,
        })
        .select()
        .single();

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    // Notification mutations
    markNotificationAsRead: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const { data, error } = await supabaseAdmin
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', context.user.id)
        .select()
        .single();

      if (error) throw new GraphQLError(error.message);
      return data;
    },

    markAllNotificationsAsRead: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const { error } = await supabaseAdmin
        .from('notifications')
        .update({ read: true })
        .eq('user_id', context.user.id)
        .eq('read', false);

      if (error) throw new GraphQLError(error.message);
      return true;
    },
  },

  // ============================================
  // NESTED RESOLVERS
  // ============================================
  User: {
    profile: async (parent: any) => {
      const { data } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('user_id', parent.id)
        .single();
      return data;
    },
    accounts: async (parent: any) => {
      const { data } = await supabaseAdmin
        .from('accounts')
        .select('*')
        .eq('user_id', parent.id);
      return data || [];
    },
    cards: async (parent: any) => {
      const { data } = await supabaseAdmin
        .from('cards')
        .select('*')
        .eq('user_id', parent.id);
      return data || [];
    },
  },

  Account: {
    transactions: async (parent: any) => {
      const { data } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .or(`from_account_id.eq.${parent.id},to_account_id.eq.${parent.id}`)
        .order('created_at', { ascending: false })
        .limit(10);
      return data || [];
    },
  },

  Transaction: {
    from_account: async (parent: any) => {
      if (!parent.from_account_id) return null;
      const { data } = await supabaseAdmin
        .from('accounts')
        .select('*')
        .eq('id', parent.from_account_id)
        .single();
      return data;
    },
    to_account: async (parent: any) => {
      if (!parent.to_account_id) return null;
      const { data } = await supabaseAdmin
        .from('accounts')
        .select('*')
        .eq('id', parent.to_account_id)
        .single();
      return data;
    },
    fees: async (parent: any) => {
      const { data } = await supabaseAdmin
        .from('transaction_fees')
        .select('*')
        .eq('transaction_id', parent.id);
      return data || [];
    },
  },

  Card: {
    transactions: async (parent: any) => {
      const { data } = await supabaseAdmin
        .from('card_transactions')
        .select('*, transaction:transactions(*)')
        .eq('card_id', parent.id)
        .order('created_at', { ascending: false })
        .limit(10);
      return data || [];
    },
  },
};
