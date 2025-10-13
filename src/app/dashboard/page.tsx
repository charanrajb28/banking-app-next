// src/app/dashboard/page.tsx
import BalanceCard from '@/components/dashboard/BalanceCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentTransactions from '@/components/dashboard/RecentTransactions';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BalanceCard
          title="Savings Account"
          balance={25840.50}
          accountNumber="4521"
          change={12.5}
          changeType="increase"
          gradient="bg-gradient-to-br from-blue-600 to-blue-700"
        />
        <BalanceCard
          title="Current Account"
          balance={8920.75}
          accountNumber="7832"
          change={-3.2}
          changeType="decrease"
          gradient="bg-gradient-to-br from-purple-600 to-purple-700"
        />
        <BalanceCard
          title="Investment Account"
          balance={45200.00}
          accountNumber="9156"
          change={18.7}
          changeType="increase"
          gradient="bg-gradient-to-br from-green-600 to-green-700"
        />
      </div>

      {/* Quick Actions and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        <RecentTransactions />
      </div>

      {/* Additional Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spending Chart Placeholder */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Monthly Spending
          </h3>
          <div className="h-48 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
            <p className="text-slate-500">Chart Component (Phase 6)</p>
          </div>
        </div>

        {/* Goals Tracker Placeholder */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Savings Goals
          </h3>
          <div className="h-48 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
            <p className="text-slate-500">Goals Tracker (Phase 6)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
