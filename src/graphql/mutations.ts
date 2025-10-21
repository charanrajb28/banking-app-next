// src/graphql/mutations.ts
import { gql } from '@apollo/client';

// ============================================
// ACCOUNT MUTATIONS
// ============================================

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      id
      account_number
      account_type
      account_name
      balance
      status
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($id: ID!, $accountName: String, $status: String) {
    updateAccount(id: $id, account_name: $accountName, status: $status) {
      id
      account_name
      status
      updated_at
    }
  }
`;

// ============================================
// TRANSACTION MUTATIONS
// ============================================

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      transaction_id
      transaction_type
      amount
      status
      description
      created_at
    }
  }
`;

export const CANCEL_TRANSACTION = gql`
  mutation CancelTransaction($id: ID!) {
    cancelTransaction(id: $id) {
      id
      status
      updated_at
    }
  }
`;

// ============================================
// CARD MUTATIONS
// ============================================

export const CREATE_CARD = gql`
  mutation CreateCard($input: CreateCardInput!) {
    createCard(input: $input) {
      id
      card_number
      card_type
      card_name
      card_brand
      expiry_date
      status
    }
  }
`;

export const UPDATE_CARD_STATUS = gql`
  mutation UpdateCardStatus($id: ID!, $status: String!) {
    updateCardStatus(id: $id, status: $status) {
      id
      status
      updated_at
    }
  }
`;

export const UPDATE_CARD_LIMITS = gql`
  mutation UpdateCardLimits($id: ID!, $dailyLimit: Float, $monthlyLimit: Float) {
    updateCardLimits(id: $id, daily_limit: $dailyLimit, monthly_limit: $monthlyLimit) {
      id
      daily_limit
      monthly_limit
      updated_at
    }
  }
`;

// ============================================
// BUDGET MUTATIONS
// ============================================

export const CREATE_BUDGET = gql`
  mutation CreateBudget($input: CreateBudgetInput!) {
    createBudget(input: $input) {
      id
      category
      budgeted_amount
      period
      start_date
      end_date
      status
    }
  }
`;

export const UPDATE_BUDGET = gql`
  mutation UpdateBudget($id: ID!, $budgetedAmount: Float, $status: String) {
    updateBudget(id: $id, budgeted_amount: $budgetedAmount, status: $status) {
      id
      budgeted_amount
      status
      updated_at
    }
  }
`;

export const DELETE_BUDGET = gql`
  mutation DeleteBudget($id: ID!) {
    deleteBudget(id: $id)
  }
`;

// ============================================
// GOAL MUTATIONS
// ============================================

export const CREATE_GOAL = gql`
  mutation CreateGoal($input: CreateGoalInput!) {
    createGoal(input: $input) {
      id
      goal_name
      target_amount
      current_amount
      deadline
      priority
      status
    }
  }
`;

export const UPDATE_GOAL = gql`
  mutation UpdateGoal($id: ID!, $currentAmount: Float, $status: String) {
    updateGoal(id: $id, current_amount: $currentAmount, status: $status) {
      id
      current_amount
      status
      updated_at
    }
  }
`;

export const DELETE_GOAL = gql`
  mutation DeleteGoal($id: ID!) {
    deleteGoal(id: $id)
  }
`;

// ============================================
// PROFILE MUTATIONS
// ============================================

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      full_name
      phone
      updated_at
      profile {
        avatar_url
        occupation
      }
    }
  }
`;

export const UPDATE_NOTIFICATION_SETTINGS = gql`
  mutation UpdateNotificationSettings($settings: JSON!) {
    updateNotificationSettings(settings: $settings) {
      id
      profile {
        notification_settings
      }
    }
  }
`;

// ============================================
// NOTIFICATION MUTATIONS
// ============================================

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      read
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsAsRead
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id)
  }
`;

// ============================================
// SECURITY MUTATIONS
// ============================================

export const ENABLE_TWO_FACTOR = gql`
  mutation EnableTwoFactor {
    enableTwoFactor {
      id
      two_factor_enabled
    }
  }
`;

export const DISABLE_TWO_FACTOR = gql`
  mutation DisableTwoFactor {
    disableTwoFactor {
      id
      two_factor_enabled
    }
  }
`;

export const REMOVE_DEVICE = gql`
  mutation RemoveDevice($id: ID!) {
    removeDevice(id: $id)
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(current_password: $currentPassword, new_password: $newPassword)
  }
`;

// ============================================
// ADMIN MUTATIONS
// ============================================

export const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($userId: ID!, $status: String!) {
    updateUserStatus(user_id: $userId, status: $status) {
      id
      kyc_status
    }
  }
`;

export const FLAG_TRANSACTION = gql`
  mutation FlagTransaction($transactionId: ID!, $reason: String!) {
    flagTransaction(transaction_id: $transactionId, reason: $reason) {
      id
      flagged
    }
  }
`;

export const UNFLAG_TRANSACTION = gql`
  mutation UnflagTransaction($transactionId: ID!) {
    unflagTransaction(transaction_id: $transactionId) {
      id
      flagged
    }
  }
`;
