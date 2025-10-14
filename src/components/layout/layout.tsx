// src/components/layout/Layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  setDarkMode(savedTheme === 'dark');
}, []);


  const toggleTheme = () => {
  const html = document.documentElement;
  if (darkMode) {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    setDarkMode(false);
  } else {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    setDarkMode(true);
  }
};


  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ${darkMode ? 'dark' : ''}`}>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />

        {/* Grid Layout */}
        <div className="flex-1 grid grid-cols-5 h-full overflow-hidden">
          {/* Sidebar */}
          <aside className={`col-span-5 lg:col-span-1 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static z-50 h-full`}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </aside>

          {/* Main Content */}
          <main
            className="col-span-5 lg:col-span-4 overflow-auto p-4 lg:p-6 transition-colors duration-300"
            style={{
              backgroundColor: 'var(--background)',
              color: 'var(--text-primary)',
            }}
          >
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
