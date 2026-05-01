/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CURRENCY_SYMBOL } from '../../constants';
import { useTransactions } from '../../services/transactions';
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const COLORS = ['#f97316', '#10b981', '#3b82f6', '#a855f7', '#64748b', '#ec4899', '#eab308'];

export default function Stats() {
  const { transactions, loading } = useTransactions();

  const { categoryData, weeklyData, monthlyTrend } = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // 1. Category Data
    const categories: Record<string, number> = {};
    expenses.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + Number(t.amount);
    });
    
    const categoryResult = Object.entries(categories)
      .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }))
      .sort((a, b) => b.value - a.value);

    // 2. Weekly Trend (Last 7 Days)
    const sevenDays = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dayStr = format(d, 'yyyy-MM-dd');
      const dayExpense = transactions
        .filter(t => t.date.startsWith(dayStr) && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const dayIncome = transactions
        .filter(t => t.date.startsWith(dayStr) && t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      return { name: format(d, 'EEE'), expense: dayExpense, income: dayIncome };
    });

    // 3. Monthly Trend (Daily of this month)
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const monthlyData = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d > new Date()) break;
      const dayStr = format(d, 'yyyy-MM-dd');
      const amount = expenses
        .filter(t => t.date.startsWith(dayStr))
        .reduce((sum, t) => sum + Number(t.amount), 0);
      monthlyData.push({ date: format(d, 'dd'), amount });
    }

    return { 
      categoryData: categoryResult, 
      weeklyData: sevenDays,
      monthlyTrend: monthlyData
    };
  }, [transactions]);

  if (loading) return (
    <div className="p-20 text-center text-muted-foreground animate-pulse">
      Calculating analytics...
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold tracking-tight font-heading">Analytics</h2>
        <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">Visualizing your financial health 📉</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md rounded-[32px] overflow-hidden shadow-sm">
          <CardHeader className="pb-0 pt-6 px-6">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-60">Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
                    formatter={(value: number) => [`${CURRENCY_SYMBOL}${value.toLocaleString()}`, 'Spent']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4">
              {categoryData.slice(0, 6).map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-wider">{c.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md rounded-[32px] shadow-sm flex flex-col">
          <CardHeader className="pb-0 pt-6 px-6">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-60">Weekly Income vs Exp.</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col justify-end">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fontWeight: 'bold', opacity: 0.5 }} />
                  <YAxis fontSize={9} axisLine={false} tickLine={false} tick={{ fontWeight: 'bold', opacity: 0.5 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={12} />
                  <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Total spending this month */}
        <Card className="md:col-span-2 border-border/40 bg-card/40 backdrop-blur-md rounded-[32px] shadow-sm">
          <CardHeader className="pb-2 pt-6 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-60">Daily Spending Heat</CardTitle>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-[10px] px-2">{format(new Date(), 'MMMM yyyy')}</Badge>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMonth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                  <XAxis dataKey="date" fontSize={9} axisLine={false} tickLine={false} tick={{ fontWeight: 'bold', opacity: 0.5 }} />
                  <YAxis fontSize={9} axisLine={false} tickLine={false} tick={{ fontWeight: 'bold', opacity: 0.5 }} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    fillOpacity={1}
                    fill="url(#colorMonth)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
                    labelFormatter={(label) => `Day ${label}`}
                    formatter={(value: number) => [`${CURRENCY_SYMBOL}${value.toLocaleString()}`, 'Spent']}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
