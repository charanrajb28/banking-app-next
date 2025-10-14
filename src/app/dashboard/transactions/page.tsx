// src/app/dashboard/transactions/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  Search, 
  Download,
  Plus,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

const mockTransactions = [
  { id: 'TXN001', type: 'credit', description: 'Salary Payment - Tech Corp', amount: 5000.00, date: '2025-10-13T10:30:00', status: 'completed', category: 'Income', account: 'Primary Savings', recipient: 'You', method: 'Direct Deposit' },
  { id: 'TXN002', type: 'debit', description: 'Transfer to Sarah Wilson', amount: 250.00, date: '2025-10-12T15:45:00', status: 'completed', category: 'Transfer', account: 'Primary Savings', recipient: 'Sarah Wilson', method: 'UPI Transfer' },
  { id: 'TXN003', type: 'debit', description: 'Amazon Purchase', amount: 89.99, date: '2025-10-12T09:20:00', status: 'completed', category: 'Shopping', account: 'Primary Savings', recipient: 'Amazon', method: 'Card Payment' },
  { id: 'TXN004', type: 'credit', description: 'Refund - Electronics Store', amount: 199.00, date: '2025-10-11T14:15:00', status: 'completed', category: 'Refund', account: 'Primary Savings', recipient: 'You', method: 'Bank Transfer' },
  { id: 'TXN005', type: 'debit', description: 'Monthly Subscription - Netflix', amount: 15.99, date: '2025-10-10T08:00:00', status: 'completed', category: 'Entertainment', account: 'Primary Savings', recipient: 'Netflix', method: 'Auto Payment' },
  { id: 'TXN006', type: 'debit', description: 'Coffee Shop - Downtown', amount: 4.50, date: '2025-10-09T16:30:00', status: 'pending', category: 'Food & Dining', account: 'Primary Savings', recipient: 'Coffee Shop', method: 'Card Payment' }
];

const categories = [
  { id: 'all', name: 'All Categories', count: mockTransactions.length },
  { id: 'income', name: 'Income', count: 2 },
  { id: 'transfer', name: 'Transfers', count: 1 },
  { id: 'shopping', name: 'Shopping', count: 1 },
  { id: 'food', name: 'Food & Dining', count: 1 },
  { id: 'entertainment', name: 'Entertainment', count: 1 }
];

export default function TransactionsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };
  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) || transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transaction.category.toLowerCase() === selectedCategory || (selectedCategory === 'food' && transaction.category === 'Food & Dining');
    return matchesSearch && matchesCategory;
  });

  const totalCredits = mockTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = mockTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 style={{ color: 'var(--card-text)' }} className="text-3xl font-bold">Transactions</h1>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mt-1">Track all your financial activities</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="flex items-center px-4 py-2 rounded-xl transition-colors" style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </button>
          <Link href="/dashboard/transactions/transfer" className="flex items-center px-4 py-2 rounded-xl shadow-lg text-white" style={{ background: 'linear-gradient(to right, #2563eb, #4f46e5)' }}>
            <Plus className="h-4 w-4 mr-2" /> New Transfer
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Income', amount: totalCredits, icon: TrendingUp, color: 'green' },
          { label: 'Total Expenses', amount: totalDebits, icon: TrendingDown, color: 'red' },
          { label: 'Net Change', amount: totalCredits - totalDebits, icon: ArrowUpRight, color: 'blue' }
        ].map((card, i) => (
          <div key={i} className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">{card.label}</p>
                <p style={{ color: `var(--${card.color}-600)` }} className="text-2xl font-bold">{formatCurrency(card.amount)}</p>
                <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm mt-1">This month</p>
              </div>
              <div className={`p-3 rounded-xl`} style={{ backgroundColor: `var(--${card.color}-100)` }}>
                <card.icon className={`h-6 w-6 text-${card.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--card-text-secondary)' }} />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search transactions..." className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none" style={{ backgroundColor: 'var(--card-bg-alt)', borderColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }} />
          </div>
          <div className="flex space-x-3">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="flex items-center px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}>
              <Filter className="h-4 w-4 mr-2" /> Filters
            </button>
            <button className="flex items-center px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}>
              <Download className="h-4 w-4 mr-2" /> Export
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-700 rounded-xl p-1 mt-6 overflow-x-auto">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all`} style={selectedCategory === cat.id ? { backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' } : { color: 'var(--card-text-secondary)' }}>
              {cat.name}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs`} style={selectedCategory === cat.id ? { backgroundColor: 'var(--card-bg)', color: 'var(--card-text)' } : { backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text-secondary)' }}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--card-bg-alt)' }}>
          <h3 style={{ color: 'var(--card-text)' }} className="text-lg font-semibold">Recent Activity ({filteredTransactions.length})</h3>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--card-bg-alt)' }}>
          {filteredTransactions.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }} className="p-6 rounded-xl transition-colors cursor-pointer" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: t.type === 'credit' ? 'var(--green-100)' : 'var(--red-100)' }}>
                    {t.type === 'credit' ? <ArrowDownLeft className="h-5 w-5" style={{ color: 'var(--green-600)' }} /> : <ArrowUpRight className="h-5 w-5" style={{ color: 'var(--red-600)' }} />}
                  </div>
                  <div>
                    <p style={{ color: 'var(--card-text)' }} className="font-semibold">{t.description}</p>
                    <div className="flex items-center space-x-2 mt-1" style={{ color: 'var(--card-text-secondary)' }}>
                      <span>{t.category}</span>
                      <span>•</span>
                      <span>{t.method}</span>
                      <span>•</span>
                      <span style={{ backgroundColor: t.status==='completed' ? 'var(--green-100)' : 'var(--yellow-100)', color: t.status==='completed' ? 'var(--green-600)' : 'var(--yellow-600)' }} className="text-xs px-2 py-1 rounded-full font-medium">{t.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p style={{ color: t.type==='credit'?'var(--green-600)':'var(--red-600)' }} className="font-bold text-lg">{t.type==='credit'?'+':'-'}{formatCurrency(t.amount)}</p>
                    <div style={{ color: 'var(--card-text-secondary)' }} className="text-sm">
                      <p>{formatDate(t.date)}</p>
                      <p>{formatTime(t.date)}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg transition-colors" style={{ color: 'var(--card-text-secondary)' }}>
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTransactions.length===0 && (
          <div className="text-center py-12" style={{ color: 'var(--card-text-secondary)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <Search className="h-8 w-8" />
            </div>
            <p className="text-lg">No transactions found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
