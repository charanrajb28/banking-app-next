// src/components/admin/AdminReports.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const reportTypes = [
  {
    id: 'financial',
    name: 'Financial Summary Report',
    description: 'Detailed overview of all financial transactions and account balances',
    icon: DollarSign,
    color: 'from-green-600 to-green-700',
    formats: ['PDF', 'Excel', 'CSV'],
    frequency: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']
  },
  {
    id: 'user_activity',
    name: 'User Activity Report',
    description: 'User engagement metrics, login patterns, and activity trends',
    icon: Users,
    color: 'from-blue-600 to-blue-700',
    formats: ['PDF', 'Excel'],
    frequency: ['Daily', 'Weekly', 'Monthly']
  },
  {
    id: 'transaction',
    name: 'Transaction Analysis',
    description: 'Comprehensive analysis of all transaction types and volumes',
    icon: TrendingUp,
    color: 'from-purple-600 to-purple-700',
    formats: ['PDF', 'Excel', 'CSV'],
    frequency: ['Daily', 'Weekly', 'Monthly', 'Custom']
  },
  {
    id: 'compliance',
    name: 'Compliance & Audit Report',
    description: 'Regulatory compliance data and audit trail information',
    icon: FileText,
    color: 'from-red-600 to-red-700',
    formats: ['PDF'],
    frequency: ['Monthly', 'Quarterly', 'Yearly']
  },
  {
    id: 'fraud',
    name: 'Fraud Detection Report',
    description: 'Flagged transactions, suspicious activities, and risk assessments',
    icon: AlertCircle,
    color: 'from-orange-600 to-orange-700',
    formats: ['PDF', 'Excel'],
    frequency: ['Daily', 'Weekly', 'Monthly']
  },
  {
    id: 'performance',
    name: 'System Performance Report',
    description: 'Platform uptime, API response times, and system health metrics',
    icon: BarChart3,
    color: 'from-indigo-600 to-indigo-700',
    formats: ['PDF', 'Excel'],
    frequency: ['Daily', 'Weekly', 'Monthly']
  }
];

const recentReports = [
  {
    id: 'RPT001',
    name: 'Financial Summary - October 2025',
    type: 'Financial Summary Report',
    generatedBy: 'Admin User',
    generatedAt: '2025-10-13T14:30:00',
    status: 'completed',
    format: 'PDF',
    size: '2.4 MB'
  },
  {
    id: 'RPT002',
    name: 'User Activity - Week 41',
    type: 'User Activity Report',
    generatedBy: 'System Auto',
    generatedAt: '2025-10-13T08:00:00',
    status: 'completed',
    format: 'Excel',
    size: '1.8 MB'
  },
  {
    id: 'RPT003',
    name: 'Compliance Audit - Q3 2025',
    type: 'Compliance & Audit Report',
    generatedBy: 'Admin User',
    generatedAt: '2025-10-12T16:45:00',
    status: 'completed',
    format: 'PDF',
    size: '5.7 MB'
  },
  {
    id: 'RPT004',
    name: 'Fraud Detection - Daily',
    type: 'Fraud Detection Report',
    generatedBy: 'System Auto',
    generatedAt: '2025-10-13T00:00:00',
    status: 'processing',
    format: 'PDF',
    size: '-'
  }
];

export default function AdminReports() {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [selectedFrequency, setSelectedFrequency] = useState('Monthly');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setShowGenerateModal(false);
      // Show success message
    }, 2000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Generate and download comprehensive reports for analysis and compliance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Reports</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">247</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">This month</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Scheduled</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">18</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Automated</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Processing</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">In progress</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Storage Used</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">24.8 GB</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">of 100 GB</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Report Templates */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
            Report Templates
          </h4>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Templates
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report, index) => {
            const Icon = report.icon;
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-blue-500 transition-all cursor-pointer group"
                onClick={() => {
                  setSelectedReport(report);
                  setShowGenerateModal(true);
                }}
              >
                <div className={`p-3 rounded-xl bg-gradient-to-r ${report.color} inline-flex mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <h5 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {report.name}
                </h5>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {report.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {report.formats.map((format) => (
                    <span key={format} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                      {format}
                    </span>
                  ))}
                </div>

                <button className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
                  Generate Report
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Reports
            </h4>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {recentReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-slate-900 dark:text-white">
                      {report.name}
                    </h5>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {report.type}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        by {report.generatedBy}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {formatTime(report.generatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    {report.status === 'completed' ? (
                      <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium rounded-full">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-sm font-medium rounded-full">
                        <Clock className="h-4 w-4 mr-1" />
                        Processing
                      </span>
                    )}
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {report.format} • {report.size}
                    </div>
                  </div>

                  {report.status === 'completed' && (
                    <button className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Generate Report
              </h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <AlertCircle className="h-6 w-6 text-slate-400" />
              </button>
            </div>

            {selectedReport && (
              <div className="space-y-6">
                {/* Report Info */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {selectedReport.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedReport.description}
                  </p>
                </div>

                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedReport.formats.map((format: string) => (
                      <button
                        key={format}
                        onClick={() => setSelectedFormat(format)}
                        className={`p-3 border-2 rounded-xl font-medium transition-all ${
                          selectedFormat === format
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frequency Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Report Period
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedReport.frequency.map((freq: string) => (
                      <button
                        key={freq}
                        onClick={() => setSelectedFrequency(freq)}
                        className={`p-3 border-2 rounded-xl font-medium transition-all ${
                          selectedFrequency === freq
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Date Range */}
                {selectedFrequency === 'Custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5 mr-2" />
                        Generate Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
