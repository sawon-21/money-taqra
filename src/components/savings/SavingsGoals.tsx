/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Target, Plus, TrendingUp, ShieldCheck, Laptop, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CURRENCY_SYMBOL } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';

const GOALS = [
  { id: '1', name: 'Emergency Fund', target: 50000, current: 15000, icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { id: '2', name: 'New Laptop', target: 85000, current: 32000, icon: Laptop, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
  { id: '3', name: 'Web Dev Course', target: 5000, current: 4000, icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
];

export default function SavingsGoals() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight font-heading">Savings Goals</h2>
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black opacity-60">Building your future</p>
        </div>
        <Button className="rounded-[1.25rem] shadow-lg shadow-primary/20 gap-2 h-12 px-6 font-bold">
          <Plus size={18} strokeWidth={3} /> Add Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GOALS.map((goal, i) => {
          const percent = (goal.current / goal.target) * 100;
          const Icon = goal.icon;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 25 }}
              key={goal.id}
            >
              <Card className="border-border/40 overflow-hidden group shadow-sm hover:shadow-lg transition-all bg-card/60 backdrop-blur-xl rounded-[2rem]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className={`p-4 rounded-[1.25rem] border shadow-inner ${goal.bg} ${goal.color}`}>
                      <Icon size={28} strokeWidth={2.5} />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black tracking-tighter">{percent.toFixed(0)}%</p>
                      <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground opacity-60">Complete</p>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 tracking-tight">{goal.name}</h3>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground opacity-60">Saved</p>
                      <p className="text-2xl font-black tracking-tighter">{CURRENCY_SYMBOL}{goal.current.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground opacity-60">Target</p>
                      <p className="text-sm font-semibold opacity-80">{CURRENCY_SYMBOL}{goal.target.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="relative h-4 bg-muted/50 rounded-full overflow-hidden shadow-inner p-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 + (i * 0.1) }}
                      className={`absolute top-0 left-0 h-full rounded-full ${goal.bg.split(' ')[0].replace('/10', '')}`}
                      style={{ background: 'currentColor' }}
                    >
                      <div className={`w-full h-full opacity-50 ${goal.color}`} style={{ backgroundColor: 'currentColor' }} />
                    </motion.div>
                  </div>
                  
                  <p className="text-[11px] font-semibold text-muted-foreground mt-5 text-center bg-muted/30 py-2 rounded-xl border border-border/40">
                    Only <span className="font-bold text-foreground">{CURRENCY_SYMBOL}{(goal.target - goal.current).toLocaleString()}</span> more to reach your goal!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white border-none shadow-2xl shadow-indigo-500/20 overflow-hidden relative rounded-[2rem]">
          <div className="absolute top-[-50%] right-[-10%] p-8 opacity-10 scale-150 rotate-12 mix-blend-overlay">
            <TrendingUp size={200} />
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="p-5 bg-white/20 rounded-[1.5rem] backdrop-blur-md shadow-inner shrink-0">
                <Target size={36} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-2xl font-black mb-2 tracking-tight">AI Savings Strategy</h4>
                <p className="text-sm text-white/90 leading-relaxed font-medium">
                  You can reach your <strong className="font-black bg-white/20 px-2 py-0.5 rounded-md">New Laptop</strong> goal 2 months faster if you reduce <strong className="font-black bg-white/20 px-2 py-0.5 rounded-md">Eating Out</strong> by 15% this month. Keep it up!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
