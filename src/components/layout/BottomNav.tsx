/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from 'wouter';
import { Home, ListOrdered, Sparkles, PieChart, Wallet, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/transactions', icon: ListOrdered, label: 'Trans.' },
  { href: '/ai', icon: Sparkles, label: 'AI' },
  { href: '/stats', icon: PieChart, label: 'Stats' },
  { href: '/accounts', icon: Wallet, label: 'Accounts' },
  { href: '/more', icon: MoreHorizontal, label: 'More' },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="bg-background/70 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-around p-1.5 gap-1 overflow-hidden pointer-events-auto">
      {navItems.map((item) => {
        const isActive = location === item.href;
        const Icon = item.icon;
        
        return (
          <Link key={item.href} href={item.href} className="relative w-full z-10">
            <button
              className={cn(
                "w-full flex flex-col items-center justify-center py-2.5 px-0.5 rounded-full transition-all duration-300 relative z-10",
                isActive 
                  ? "text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 bg-primary/90 shadow-md shadow-primary/20 rounded-full z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} className="transition-all duration-300" />
                <span className={cn(
                  "text-[9px] font-bold mt-1 tracking-tight transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-0 h-0 mt-0 overflow-hidden"
                )}>
                  {item.label}
                </span>
              </div>
            </button>
          </Link>
        );
      })}
    </nav>
  );
}
