// src/graphql/schema.ts
import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime
  scalar JSON

  # ============================================
  # USER TYPES
  # ============================================
  
  type User {
    id: ID!
    email: String!
    phone: String
    full_name: String!
    date_of_birth: String
    address: JSON
    kyc_status: String!
    risk_level: String!
    role: String!
    two_factor_enabled: Boolean!
    created_at: DateTime!
    updated_at: DateTime!
    profile: UserProfile
    accounts: [Account!]!
    cards: [Card!]!
  }

  type UserProfile {
    id: ID!
    user_id: ID!
    avatar_url: String
    occupation: String
    annual_income: Float
    preferences: JSON
    notification_settings: JSON
    created_at: DateTime!
    updated_at: DateTime!
  }

  # ============================================
  # ACCOUNT TYPES
  # ============================================
  
  type Account {
    id: ID!
    user_id: ID!
    account_number: String!
    account_type: String!
    account_name: String!
    balance: Float!
    currency: String!
    status: String!
    interest_rate: Float
    monthly_limit: Float
    daily_limit: Float
    created_at: DateTime!
    updated_at: DateTime!
    transactions: [Transaction!]!
    statements: [AccountStatement!]!
  }

  type AccountStatement {
    id: ID!
    account_id: ID!
    statement_date: String!
    opening_balance: Float!
    closing_balance: Float!
    total_credits: Float!
    total_debits: Float!
    file_url: String
    created_at: DateTime!
  }

  # ============================================
  # TRANSACTION TYPES
  # ============================================
  
  type Transaction {
    id: ID!
    transaction_id: String!
    user_id: ID!
    from_account_id: ID
    to_account_id: ID
    from_account: Account
    to_account: Account
    transaction_type: String!
    amount: Float!
    currency: String!
    status: String!
    description: String
    category: String
    payment_method: String
    reference_number: String
    metadata: JSON
    risk_score: Int
    flagged: Boolean!
    created_at: DateTime!
    updated_at: DateTime!
    fees: [TransactionFee!]!
  }

  type TransactionFee {
    id: ID!
    transaction_id: ID!
    fee_type: String!
    fee_amount: Float!
    currency: String!
    created_at: DateTime!
  }

  # ============================================
  # CARD TYPES
  # ============================================
  
  type Card {
    id: ID!
    user_id: ID!
    account_id: ID!
    card_number: String!
    card_type: String!
    card_name: String!
    card_brand: String
    expiry_date: String!
    card_holder_name: String!
    status: String!
    daily_limit: Float
    monthly_limit: Float
    settings: JSON
    created_at: DateTime!
    updated_at: DateTime!
    transactions: [CardTransaction!]!
  }

  type CardTransaction {
    id: ID!
    card_id: ID!
    transaction_id: ID!
    merchant_name: String!
    merchant_category: String
    merchant_location: String
    authorization_code: String
    created_at: DateTime!
    transaction: Transaction!
  }

  # ============================================
  # BUDGET & GOALS TYPES
  # ============================================
  
  type Budget {
    id: ID!
    user_id: ID!
    category: String!
    budgeted_amount: Float!
    spent_amount: Float!
    period: String!
    start_date: String!
    end_date: String!
    status: String!
    created_at: DateTime!
    updated_at: DateTime!
  }

  type FinancialGoal {
    id: ID!
    user_id: ID!
    goal_name: String!
    target_amount: Float!
    current_amount: Float!
    deadline: String
    priority: String!
    status: String!
    icon: String
    created_at: DateTime!
    updated_at: DateTime!
  }

  # ============================================
  # NOTIFICATION TYPES
  # ============================================
  
  type Notification {
    id: ID!
    user_id: ID!
    type: String!
    title: String!
    message: String!
    priority: String!
    read: Boolean!
    category: String!
    icon: String
    action_url: String
    metadata: JSON
    created_at: DateTime!
  }

  # ============================================
  # SECURITY TYPES
  # ============================================
  
  type SecurityLog {
    id: ID!
    user_id: ID!
    event_type: String!
    ip_address: String
    device_info: JSON
    location: String
    success: Boolean!
    metadata: JSON
    created_at: DateTime!
  }

  type Device {
    id: ID!
    user_id: ID!
    device_name: String!
    device_type: String
    browser: String
    os: String
    ip_address: String
    location: String
    is_current: Boolean!
    last_used: DateTime!
    trusted: Boolean!
    created_at: DateTime!
  }

  # ============================================
  # ANALYTICS TYPES
  # ============================================
  
  type SpendingAnalytics {
    total_spent: Float!
    total_income: Float!
    savings_rate: Float!
    top_category: String
    monthly_trend: [MonthlyTrend!]!
    category_breakdown: [CategoryBreakdown!]!
  }

  type MonthlyTrend {
    month: String!
    spending: Float!
    income: Float!
    savings: Float!
  }

  type CategoryBreakdown {
    category: String!
    amount: Float!
    percentage: Float!
    count: Int!
  }

  # ============================================
  # INPUT TYPES
  # ============================================
  
  input CreateAccountInput {
    account_type: String!
    account_name: String!
    initial_balance: Float
  }

  input CreateTransactionInput {
    from_account_id: ID!
    to_account_id: ID
    amount: Float!
    transaction_type: String!
    description: String
    category: String
    payment_method: String
  }

  input CreateCardInput {
    account_id: ID!
    card_type: String!
    card_name: String!
    card_brand: String!
    daily_limit: Float
    monthly_limit: Float
  }

  input CreateBudgetInput {
    category: String!
    budgeted_amount: Float!
    period: String!
    start_date: String!
    end_date: String!
  }

  input CreateGoalInput {
    goal_name: String!
    target_amount: Float!
    deadline: String
    priority: String
  }

  input UpdateProfileInput {
    full_name: String
    phone: String
    address: JSON
    avatar_url: String
    occupation: String
  }

  input TransactionFilter {
    status: String
    transaction_type: String
    category: String
    start_date: String
    end_date: String
    min_amount: Float
    max_amount: Float
  }

  # ============================================
  # QUERIES
  # ============================================
  
  type Query {
    # User queries
    me: User!
    user(id: ID!): User
    
    # Account queries
    accounts: [Account!]!
    account(id: ID!): Account
    accountBalance(id: ID!): Float!
    
    # Transaction queries
    transactions(filter: TransactionFilter, limit: Int, offset: Int): [Transaction!]!
    transaction(id: ID!): Transaction
    transactionsByAccount(account_id: ID!, limit: Int): [Transaction!]!
    
    # Card queries
    cards: [Card!]!
    card(id: ID!): Card
    cardTransactions(card_id: ID!, limit: Int): [CardTransaction!]!
    
    # Budget & Goals queries
    budgets(status: String): [Budget!]!
    budget(id: ID!): Budget
    goals(status: String): [FinancialGoal!]!
    goal(id: ID!): FinancialGoal
    
    # Analytics queries
    spendingAnalytics(start_date: String, end_date: String): SpendingAnalytics!
    monthlySpending(year: Int!, month: Int!): Float!
    categorySpending(category: String!): Float!
    
    # Notification queries
    notifications(read: Boolean, limit: Int): [Notification!]!
    unreadNotificationCount: Int!
    
    # Security queries
    securityLogs(limit: Int): [SecurityLog!]!
    devices: [Device!]!
    
    # Admin queries
    allUsers(limit: Int, offset: Int): [User!]!
    allTransactions(limit: Int, offset: Int, flagged: Boolean): [Transaction!]!
    systemStats: JSON!
  }

  # ============================================
  # MUTATIONS
  # ============================================
  
  type Mutation {
    # Account mutations
    createAccount(input: CreateAccountInput!): Account!
    updateAccount(id: ID!, account_name: String, status: String): Account!
    closeAccount(id: ID!): Account!
    
    # Transaction mutations
    createTransaction(input: CreateTransactionInput!): Transaction!
    cancelTransaction(id: ID!): Transaction!
    
    # Card mutations
    createCard(input: CreateCardInput!): Card!
    updateCardStatus(id: ID!, status: String!): Card!
    updateCardLimits(id: ID!, daily_limit: Float, monthly_limit: Float): Card!
    
    # Budget & Goals mutations
    createBudget(input: CreateBudgetInput!): Budget!
    updateBudget(id: ID!, budgeted_amount: Float, status: String): Budget!
    deleteBudget(id: ID!): Boolean!
    
    createGoal(input: CreateGoalInput!): FinancialGoal!
    updateGoal(id: ID!, current_amount: Float, status: String): FinancialGoal!
    deleteGoal(id: ID!): Boolean!
    
    # Profile mutations
    updateProfile(input: UpdateProfileInput!): User!
    updateNotificationSettings(settings: JSON!): User!
    
    # Notification mutations
    markNotificationAsRead(id: ID!): Notification!
    markAllNotificationsAsRead: Boolean!
    deleteNotification(id: ID!): Boolean!
    
    # Security mutations
    enableTwoFactor: User!
    disableTwoFactor: User!
    removeDevice(id: ID!): Boolean!
    changePassword(current_password: String!, new_password: String!): Boolean!
    
    # Admin mutations
    updateUserStatus(user_id: ID!, status: String!): User!
    flagTransaction(transaction_id: ID!, reason: String!): Transaction!
    unflagTransaction(transaction_id: ID!): Transaction!
  }

  # ============================================
  # SUBSCRIPTIONS
  # ============================================
  
  type Subscription {
    transactionCreated(user_id: ID!): Transaction!
    notificationReceived(user_id: ID!): Notification!
    accountBalanceChanged(account_id: ID!): Float!
  }
`;
