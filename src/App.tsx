/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import Dashboard from './components/dashboard/Dashboard';
import Transactions from './components/transactions/Transactions';
import AIAssistant from './components/ai/AIAssistant';
import Stats from './components/stats/Stats';
import Accounts from './components/accounts/Accounts';
import BottomNav from './components/layout/BottomNav';
import Sidebar from './components/layout/Sidebar';
import More from './components/settings/More';
import TuitionManager from './components/tuition/TuitionManager';
import SavingsGoals from './components/savings/SavingsGoals';
import Reports from './components/reports/Reports';
import { AnimatePresence, motion } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function App() {
  const [location] = useLocation();

  useEffect(() => {
    // Initialize theme based on local storage
    const theme = localStorage.getItem('moneytaqra_theme');
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 border-r border-border/40 shrink-0 bg-card/30 backdrop-blur-3xl relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <Sidebar />
        </div>

        <main className={`flex-1 ${location.startsWith('/ai') ? 'pb-0' : 'pb-24'} lg:pb-0 overflow-x-hidden relative h-[100dvh] overflow-y-auto w-full`}>
          {/* Subtle top decoration for main content */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={
                `w-full ${!location.startsWith('/ai') ? 'p-4 sm:p-6 md:p-10 max-w-5xl mx-auto min-h-full' : 'h-full absolute inset-0'}`
              }
            >
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/transactions" component={Transactions} />
                <Route path="/ai" component={AIAssistant} />
                <Route path="/stats" component={Stats} />
                <Route path="/accounts" component={Accounts} />
                <Route path="/tuition" component={TuitionManager} />
                <Route path="/savings" component={SavingsGoals} />
                <Route path="/reports" component={Reports} />
                <Route path="/more" component={More} />
                <Route>
                  <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                    <h2 className="text-4xl font-extrabold tracking-tighter mb-2">404</h2>
                    <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
                  </div>
                </Route>
              </Switch>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation */}
        {!location.startsWith('/ai') && (
          <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
            <BottomNav />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
