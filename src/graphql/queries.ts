// src/graphql/queries.ts
import { gql } from '@apollo/client';

// ============================================
// USER QUERIES
// ============================================

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      full_name
      phone
      kyc_status
      role
      two_factor_enabled
      created_at
      profile {
        avatar_url
        occupation
        notification_settings
      }
    }
  }
`;

// ============================================
// ACCOUNT QUERIES
// ============================================

export const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
      id
      account_number
      account_type
      account_name
      balance
      currency
      status
      interest_rate
      monthly_limit
      daily_limit
      created_at
    }
  }
`;

export const GET_ACCOUNT = gql`
  query GetAccount($id: ID!) {
    account(id: $id) {
      id
      account_number
      account_type
      account_name
      balance
      currency
      status
      interest_rate
      monthly_limit
      daily_limit
      created_at
      transactions {
        id
        transaction_id
        amount
        transaction_type
        status
        description
        created_at
      }
    }
  }
`;

// ============================================
// TRANSACTION QUERIES
// ============================================

export const GET_TRANSACTIONS = gql`
  query GetTransactions($filter: TransactionFilter, $limit: Int, $offset: Int) {
    transactions(filter: $filter, limit: $limit, offset: $offset) {
      id
      transaction_id
      transaction_type
      amount
      currency
      status
      description
      category
      payment_method
      flagged
      created_at
      from_account {
        account_name
        account_number
      }
      to_account {
        account_name
        account_number
      }
    }
  }
`;

export const GET_TRANSACTION = gql`
  query GetTransaction($id: ID!) {
    transaction(id: $id) {
      id
      transaction_id
      transaction_type
      amount
      currency
      status
      description
      category
      payment_method
      reference_number
      metadata
      risk_score
      flagged
      created_at
      from_account {
        id
        account_name
        account_number
      }
      to_account {
        id
        account_name
        account_number
      }
      fees {
        fee_type
        fee_amount
      }
    }
  }
`;

// ============================================
// CARD QUERIES
// ============================================

export const GET_CARDS = gql`
  query GetCards {
    cards {
      id
      card_number
      card_type
      card_name
      card_brand
      expiry_date
      status
      daily_limit
      monthly_limit
      settings
      created_at
    }
  }
`;

export const GET_CARD_TRANSACTIONS = gql`
  query GetCardTransactions($cardId: ID!, $limit: Int) {
    cardTransactions(card_id: $cardId, limit: $limit) {
      id
      merchant_name
      merchant_category
      merchant_location
      created_at
      transaction {
        id
        amount
        status
        description
      }
    }
  }
`;

// ============================================
// BUDGET & GOALS QUERIES
// ============================================

export const GET_BUDGETS = gql`
  query GetBudgets($status: String) {
    budgets(status: $status) {
      id
      category
      budgeted_amount
      spent_amount
      period
      start_date
      end_date
      status
      created_at
    }
  }
`;

export const GET_GOALS = gql`
  query GetGoals($status: String) {
    goals(status: $status) {
      id
      goal_name
      target_amount
      current_amount
      deadline
      priority
      status
      icon
      created_at
    }
  }
`;

// ============================================
// ANALYTICS QUERIES
// ============================================

export const GET_SPENDING_ANALYTICS = gql`
  query GetSpendingAnalytics($startDate: String, $endDate: String) {
    spendingAnalytics(start_date: $startDate, end_date: $endDate) {
      total_spent
      total_income
      savings_rate
      top_category
      monthly_trend {
        month
        spending
        income
        savings
      }
      category_breakdown {
        category
        amount
        percentage
        count
      }
    }
  }
`;

// ============================================
// NOTIFICATION QUERIES
// ============================================

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($read: Boolean, $limit: Int) {
    notifications(read: $read, limit: $limit) {
      id
      type
      title
      message
      priority
      read
      category
      icon
      action_url
      created_at
    }
  }
`;

export const GET_UNREAD_COUNT = gql`
  query GetUnreadCount {
    unreadNotificationCount
  }
`;

// ============================================
// SECURITY QUERIES
// ============================================

export const GET_SECURITY_LOGS = gql`
  query GetSecurityLogs($limit: Int) {
    securityLogs(limit: $limit) {
      id
      event_type
      ip_address
      location
      success
      created_at
    }
  }
`;

export const GET_DEVICES = gql`
  query GetDevices {
    devices {
      id
      device_name
      device_type
      browser
      os
      ip_address
      location
      is_current
      last_used
      trusted
      created_at
    }
  }
`;

// ============================================
// ADMIN QUERIES
// ============================================

export const GET_ALL_USERS = gql`
  query GetAllUsers($limit: Int, $offset: Int) {
    allUsers(limit: $limit, offset: $offset) {
      id
      email
      full_name
      phone
      kyc_status
      risk_level
      role
      two_factor_enabled
      created_at
    }
  }
`;

export const GET_ALL_TRANSACTIONS = gql`
  query GetAllTransactions($limit: Int, $offset: Int, $flagged: Boolean) {
    allTransactions(limit: $limit, offset: $offset, flagged: $flagged) {
      id
      transaction_id
      user_id
      transaction_type
      amount
      status
      flagged
      risk_score
      created_at
    }
  }
`;
