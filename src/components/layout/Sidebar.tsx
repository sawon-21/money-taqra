/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from 'wouter';
import { 
  Home, 
  ListOrdered, 
  Sparkles, 
  PieChart, 
  Wallet, 
  MoreHorizontal,
  Banknote,
  Target,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/transactions', icon: ListOrdered, label: 'Transactions' },
  { href: '/ai', icon: Sparkles, label: 'AI Assistant' },
  { href: '/stats', icon: PieChart, label: 'Analytics' },
  { href: '/accounts', icon: Wallet, label: 'Accounts' },
  { href: '/tuition', icon: GraduationCap, label: 'Tuition Manager' },
  { href: '/savings', icon: Target, label: 'Savings Goals' },
  { href: '/more', icon: MoreHorizontal, label: 'Settings' },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col h-full bg-transparent p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-10 pl-2">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
          <Banknote size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight font-heading text-foreground">MoneyTaqra</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-80">Control & Build</p>
        </div>
      </div>

      <nav className="space-y-1.5 flex-1 relative">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href} className="flex relative">
              <button
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative z-10",
                  isActive 
                    ? "text-primary-foreground font-semibold" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary shadow-lg shadow-primary/30 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon size={22} className={cn(
                  isActive ? "text-primary-foreground" : "group-hover:scale-110 opacity-70 group-hover:opacity-100", 
                  "transition-all duration-300"
                )} />
                <span className="tracking-tight">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl border border-primary/10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 text-primary opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform duration-500">
          <Sparkles size={64} />
        </div>
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <Sparkles size={16} className="text-primary" />
          <p className="text-[10px] font-black text-primary uppercase tracking-widest">PRO TIP</p>
        </div>
        <p className="text-[13px] leading-relaxed text-muted-foreground font-medium relative z-10">
          Use the AI Assistant to add multiple expenses in one go! ⚡
        </p>
      </div>
    </div>
  );
}
