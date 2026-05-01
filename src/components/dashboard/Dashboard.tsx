/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wallet, TrendingUp, TrendingDown, GraduationCap, Sparkles, Plus, Utensils, Bus, Smartphone, ShoppingBag, ArrowRightLeft, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CURRENCY_SYMBOL } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress';
import { useTransactions } from '../../services/transactions';
import { useMemo, useState, useEffect } from 'react';
import AddTransaction from '../transactions/AddTransaction';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { getFinancialAdvice } from '../../services/gemini';

export default function Dashboard() {
  const { transactions, loading } = useTransactions();
  const [addOpen, setAddOpen] = useState(false);
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(true);

  const { stats, chartData, budgets } = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    let balance = 0;
    let todayExpense = 0;
    let monthIncome = 0;
    let monthExpense = 0;
    let tuitionIncome = 0;

    // Budget tracking
    const categorySpending: Record<string, number> = {};
    const budgetLimits: Record<string, number> = {
      'Food': 5000,
      'Transport': 1500,
      'Personal': 2000,
      'Education': 3000
    };

    transactions.forEach(t => {
      const amount = Number(t.amount);
      const tDate = new Date(t.date);
      const isToday = t.date.startsWith(todayStr);
      const isThisMonth = tDate.getMonth() === thisMonth && tDate.getFullYear() === thisYear;

      if (t.type === 'income') {
        balance += amount;
        if (isThisMonth) monthIncome += amount;
        if (t.category === 'Tuition Income' || t.category === 'Salary') tuitionIncome += amount;
      } else if (t.type === 'expense') {
        balance -= amount;
        if (isThisMonth) {
          monthExpense += amount;
          categorySpending[t.category] = (categorySpending[t.category] || 0) + amount;
        }
        if (isToday) todayExpense += amount;
      }
    });

    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dayStr = format(d, 'yyyy-MM-dd');
      const dayTotal = transactions
        .filter(t => t.date.startsWith(dayStr) && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      return {
        name: format(d, 'EEE'),
        amount: dayTotal
      };
    });

    const budgetsData = Object.entries(budgetLimits).map(([name, limit]) => ({
      name,
      limit,
      spent: categorySpending[name] || 0,
      color: name === 'Food' ? 'bg-orange-500' : name === 'Transport' ? 'bg-blue-500' : 'bg-emerald-500' // Keeping primary colors
    }));

    return { 
      stats: { balance, todayExpense, monthIncome, monthExpense, tuitionIncome },
      chartData: last7Days,
      budgets: budgetsData
    };
  }, [transactions]);

  useEffect(() => {
    if (!loading) {
      setLoadingAdvice(true);
      getFinancialAdvice({ 
        balance: stats.balance, 
        monthExpenses: stats.monthExpense, 
        monthIncome: stats.monthIncome, 
        budgets 
      }).then(res => {
        setAdvice(res);
        setLoadingAdvice(false);
      });
    }
  }, [stats.balance, stats.monthExpense, stats.monthIncome, budgets, loading]);

  const quickActions = [
    { label: 'Food', icon: Utensils, color: 'text-orange-600 bg-orange-500/10 border-orange-500/20', sub: 'বাজার/খাবার', action: { type: 'expense', category: 'Food', subcategory: 'Meals' } as any },
    { label: 'Travel', icon: Bus, color: 'text-blue-600 bg-blue-500/10 border-blue-500/20', sub: 'রিকশা/বাস', action: { type: 'expense', category: 'Transport', subcategory: 'Rickshaw/Bus' } as any },
    { label: 'Tuition', icon: GraduationCap, color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20', sub: 'টিউশন আয়', action: { type: 'income', category: 'Tuition Income', subcategory: 'Salary' } as any },
    { label: 'Mobile', icon: Smartphone, color: 'text-purple-600 bg-purple-500/10 border-purple-500/20', sub: 'রিচার্জ', action: { type: 'expense', category: 'Personal', subcategory: 'Mobile Recharge' } as any },
    { label: 'Market', icon: ShoppingBag, color: 'text-rose-600 bg-rose-500/10 border-rose-500/20', sub: 'মার্কেট', action: { type: 'expense', category: 'Personal', subcategory: 'Shopping' } as any },
    { label: 'Transfer', icon: ArrowRightLeft, color: 'text-slate-600 bg-slate-500/10 border-slate-500/20', sub: 'বিকাশ-ক্যাশ', action: { type: 'transfer' } as any },
  ];

  const [quickActionData, setQuickActionData] = useState<any>(null);

  const handleQuickAction = (action: any) => {
    setQuickActionData(action);
    setAddOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">MoneyTaqra</h2>
          <p className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold opacity-60">Control your student life bank 🎓</p>
        </div>
        <Button 
          size="icon" 
          className="rounded-[1.25rem] h-12 w-12 sm:h-14 sm:w-14 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95" 
          onClick={() => {
            setQuickActionData(null);
            setAddOpen(true);
          }}
        >
          <Plus className="h-6 w-6 sm:h-7 sm:w-7" />
        </Button>
      </motion.div>

      <AddTransaction 
        open={addOpen} 
        onOpenChange={(isOpen) => {
          setAddOpen(isOpen);
          if (!isOpen) {
            setQuickActionData(null);
          }
        }}
        initialData={quickActionData} 
      />

      {/* Main Balance Card */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden group bg-gradient-to-br from-primary to-primary/80 border-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] shadow-primary/30 rounded-[2rem]">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150 transform-gpu transition-transform duration-1000 group-hover:rotate-45 group-hover:scale-[1.8] pointer-events-none">
            <Wallet size={160} />
          </div>
          
          <CardContent className="p-8 sm:p-10 relative z-10 text-primary-foreground">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-primary-foreground/70 text-sm font-semibold tracking-wider uppercase mb-2">Total Balance</p>
                <h3 className="text-5xl sm:text-6xl font-black tracking-tighter">
                  {CURRENCY_SYMBOL} {stats.balance.toLocaleString()}
                </h3>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white/10 p-5 rounded-[1.5rem] backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                <p className="text-[10px] sm:text-xs uppercase font-bold text-white/70 mb-1 tracking-widest">Today's Expense</p>
                <p className="text-xl sm:text-2xl font-black">{CURRENCY_SYMBOL} {stats.todayExpense.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 p-5 rounded-[1.5rem] backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                <p className="text-[10px] sm:text-xs uppercase font-bold text-white/70 mb-1 tracking-widest">Tuition Income</p>
                <p className="text-xl sm:text-2xl font-black">{CURRENCY_SYMBOL} {stats.tuitionIncome.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">
        
        {/* Left Column */}
        <div className="space-y-8">
          {/* Month Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <Card className="bg-card/40 backdrop-blur-md border-border/40 shadow-sm rounded-[1.5rem] hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="w-12 h-12 rounded-[1rem] bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                  <TrendingUp size={24} />
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Month Income</p>
                <p className="text-2xl font-black text-emerald-600">+{CURRENCY_SYMBOL}{stats.monthIncome.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/40 backdrop-blur-md border-border/40 shadow-sm rounded-[1.5rem] hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="w-12 h-12 rounded-[1rem] bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4">
                  <TrendingDown size={24} />
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Month Exp.</p>
                <p className="text-2xl font-black text-rose-600">-{CURRENCY_SYMBOL}{stats.monthExpense.toLocaleString()}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Advice Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-md overflow-hidden relative shadow-sm rounded-[1.5rem] group hover:shadow-md transition-all pt-2 text-indigo-900 dark:text-indigo-100">
              <div className="absolute top-0 right-0 p-6 text-indigo-500/20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
                <Sparkles size={100} />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                    <Sparkles size={24} />
                  </div>
                  <h4 className="font-extrabold text-lg tracking-tight">AI Assistant</h4>
                </div>
                {loadingAdvice ? (
                  <div className="flex items-center gap-2 opacity-50 relative z-10">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span className="text-sm font-medium">Analyzing budget...</span>
                  </div>
                ) : (
                  <p className="text-sm font-medium leading-relaxed italic opacity-80 relative z-10 whitespace-pre-wrap">
                    "{advice}"
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Quick Actions</h4>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <motion.button 
                    key={action.label} 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickAction(action.action)}
                    className="group flex flex-col items-center gap-3 p-4 rounded-[1.25rem] bg-card/60 backdrop-blur-md border border-border/40 hover:border-border/80 transition-colors shadow-sm"
                  >
                    <div className={cn("p-3.5 rounded-[1rem] transition-transform duration-300 group-hover:-translate-y-1 shadow-sm border", action.color)}>
                      <Icon size={22} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold leading-none mb-1 text-foreground">{action.label}</p>
                      <p className="text-[9px] text-muted-foreground font-medium">{action.sub}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Spending Trend */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/40 bg-card/50 backdrop-blur-md overflow-hidden shadow-sm rounded-[1.5rem]">
              <CardContent className="p-0">
                <div className="p-6 flex items-center justify-between pb-2">
                  <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Spending Trend</h4>
                  <Badge variant="outline" className="text-[9px] font-black tracking-widest border-border/50 text-muted-foreground bg-muted/30">LAST 7 DAYS</Badge>
                </div>
                <div className="h-[180px] w-full px-4 -ml-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fontWeight: 'bold', opacity: 0.5 }} />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fontWeight: 'bold', opacity: 0.5 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--card)', 
                          borderRadius: '16px', 
                          border: '1px solid var(--border)', 
                          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: 'var(--foreground)'
                        }} 
                        labelStyle={{ display: 'none' }}
                        formatter={(value: number) => [`${CURRENCY_SYMBOL}${value.toLocaleString()}`, 'Spent']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="oklch(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorAmt)" 
                        strokeWidth={4}
                        activeDot={{ r: 8, strokeWidth: 0, fill: 'oklch(var(--primary))' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Budget Warnings */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Budget Watch</h4>
            <div className="grid gap-3">
              {budgets.map((budget, i) => {
                const percent = Math.min((budget.spent / budget.limit) * 100, 100);
                const isWarning = percent > 80;
                return (
                  <motion.div key={budget.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (i * 0.1) }}>
                    <Card className={cn(
                      "border-border/40 bg-card/50 backdrop-blur-sm shadow-sm rounded-[1.25rem] overflow-hidden transition-colors relative",
                      isWarning && "bg-rose-500/5 border-rose-500/20"
                    )}>
                      {isWarning && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
                      )}
                      <CardContent className="p-4 sm:p-5 relative z-10">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <span className="text-sm font-bold tracking-tight">{budget.name}</span>
                            {isWarning && (
                              <Badge className="ml-2 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-500/20 px-1.5 py-0 text-[8px] uppercase font-black uppercase tracking-widest">Warning</Badge>
                            )}
                          </div>
                          <div className="text-right flex flex-col">
                            <span className="text-sm font-black">{CURRENCY_SYMBOL}{budget.spent.toLocaleString()}</span>
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                              of {CURRENCY_SYMBOL}{budget.limit.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <Progress value={percent} className="h-2.5 bg-muted/60">
                          <ProgressTrack className="bg-transparent">
                            <ProgressIndicator className={budget.color} />
                          </ProgressTrack>
                        </Progress>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}