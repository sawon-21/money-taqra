/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { GraduationCap, Plus, Calendar, Clock, DollarSign, UserCheck, AlertCircle, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CURRENCY_SYMBOL } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '../../services/transactions';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function TuitionManager() {
  const { transactions } = useTransactions();

  const studentData = useMemo(() => {
    const tuitionTrans = transactions.filter(t => t.category === 'Tuition Income');
    const studentsMap: Record<string, any> = {};

    tuitionTrans.forEach(t => {
      const name = t.note || 'Unknown Student';
      if (!studentsMap[name]) {
        studentsMap[name] = {
          name,
          totalPaid: 0,
          fee: t.amount,
          lastPaid: t.date,
          payments: 0
        };
      }
      studentsMap[name].totalPaid += Number(t.amount);
      studentsMap[name].payments += 1;
      if (new Date(t.date) > new Date(studentsMap[name].lastPaid)) {
        studentsMap[name].lastPaid = t.date;
        studentsMap[name].fee = t.amount;
      }
    });

    return Object.values(studentsMap);
  }, [transactions]);

  const stats = useMemo(() => {
    const active = studentData.length;
    const monthlyTgt = studentData.reduce((sum, s) => sum + Number(s.fee), 0);
    const thisMonthPaid = transactions
      .filter(t => t.category === 'Tuition Income' && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    return { active, monthlyTgt, thisMonthPaid };
  }, [studentData, transactions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight font-heading">Tuition Center</h2>
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black opacity-60">Revenue from your expertise</p>
        </div>
        <Button className="rounded-[1.25rem] shadow-lg shadow-primary/20 gap-2 h-12 px-6 font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus size={18} strokeWidth={3} /> New Student
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-900/10 border-indigo-200/50 dark:border-indigo-800/30 shadow-sm rounded-[2rem] overflow-hidden relative">
            <div className="absolute -right-4 -top-4 opacity-[0.03] scale-150"><Users size={120} /></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-indigo-500 text-white rounded-2xl shadow-inner shadow-white/20"><UserCheck size={28} strokeWidth={2.5} /></div>
              </div>
              <p className="text-[10px] uppercase font-black text-indigo-600/60 dark:text-indigo-400/60 tracking-widest mb-1">Active Students</p>
              <p className="text-4xl font-black tracking-tighter text-indigo-900 dark:text-indigo-100">{stats.active}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/20 dark:to-violet-900/10 border-violet-200/50 dark:border-violet-800/30 shadow-sm rounded-[2rem] overflow-hidden relative">
            <div className="absolute -right-4 -top-4 opacity-[0.03] scale-150"><TrendingUp size={120} /></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-violet-500 text-white rounded-2xl shadow-inner shadow-white/20"><DollarSign size={28} strokeWidth={2.5} /></div>
              </div>
              <p className="text-[10px] uppercase font-black text-violet-600/60 dark:text-violet-400/60 tracking-widest mb-1">Expected Revenue</p>
              <p className="text-4xl font-black tracking-tighter text-violet-900 dark:text-violet-100">{CURRENCY_SYMBOL}{stats.monthlyTgt.toLocaleString()}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/30 shadow-sm rounded-[2rem] overflow-hidden relative">
            <div className="absolute -right-4 -top-4 opacity-[0.03] scale-150"><Clock size={120} /></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-inner shadow-white/20"><Clock size={28} strokeWidth={2.5} /></div>
              </div>
              <p className="text-[10px] uppercase font-black text-emerald-600/60 dark:text-emerald-400/60 tracking-widest mb-1">Collected This Month</p>
              <p className="text-4xl font-black tracking-tighter text-emerald-900 dark:text-emerald-100">{CURRENCY_SYMBOL}{stats.thisMonthPaid.toLocaleString()}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-muted-foreground px-2 flex items-center gap-4">
          Student Roster
          <div className="h-[1px] flex-1 bg-border/40"></div>
        </h3>
        
        {studentData.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-muted/30 rounded-[2rem] border border-dashed border-border/60">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <GraduationCap className="text-muted-foreground opacity-50" size={40} />
            </div>
            <h4 className="text-lg font-bold">No Students Yet</h4>
            <p className="text-sm font-medium text-muted-foreground mt-1 px-8">Add "Tuition Income" transactions to see results here or create a new student profile.</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentData.map((s: any, i: number) => (
            <motion.div 
              key={s.name} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border/40 hover:shadow-lg transition-all cursor-pointer shadow-sm bg-card/60 backdrop-blur-xl rounded-[1.5rem] group overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-[1rem] bg-indigo-500/10 flex items-center justify-center font-black text-indigo-500 text-2xl shadow-inner group-hover:scale-105 transition-transform">
                          {s.name[0]}
                        </div>
                        <div>
                          <h4 className="font-black text-lg tracking-tight leading-tight">{s.name}</h4>
                          <p className="text-[11px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">Fee: {CURRENCY_SYMBOL}{Number(s.fee).toLocaleString()}</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 px-3 py-1 font-black uppercase tracking-widest text-[9px]">
                        Active
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-border/40 w-full border-t border-border/40">
                    <div className="bg-card/50 p-4 flex flex-col items-center justify-center">
                      <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mb-1">Last Paid</span>
                      <span className="font-bold text-xs flex items-center gap-1.5"><Calendar size={12} className="opacity-50" /> {format(new Date(s.lastPaid), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="bg-card/50 p-4 flex flex-col items-center justify-center">
                      <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mb-1">Total Paid</span>
                      <span className="font-black text-sm text-indigo-500 tracking-tight">{CURRENCY_SYMBOL}{s.totalPaid.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
