/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileText, Download, Share2, Calendar, ChevronRight, Plus, Sparkles, Filter, AreaChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const REPORTS = [
  { name: 'Monthly Summary - May 2026', type: 'Monthly', date: 'May 1, 2026', status: 'Generated' },
  { name: 'Weekly Insight - Week 4 April', type: 'Weekly', date: 'April 28, 2026', status: 'Archived' },
  { name: 'Tuition Income Report - Q1', type: 'Quarterly', date: 'April 1, 2026', status: 'Archived' },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight font-heading">Reports</h2>
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black opacity-60">Review your financial journey</p>
        </div>
        <Button variant="outline" className="rounded-[1.25rem] h-12 px-6 font-bold bg-card/60 backdrop-blur-xl border-border/40 hover:bg-card/80 shadow-sm transition-all text-primary hover:text-primary gap-2">
          <Download size={18} strokeWidth={2.5} /> Export All
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-primary to-primary/80 border-none shadow-xl shadow-primary/20 overflow-hidden relative rounded-[2rem] text-primary-foreground">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-white/10 to-transparent"></div>
          <div className="absolute right-[-10%] top-[-50%] p-8 opacity-20 scale-150 rotate-12 mix-blend-overlay">
            <AreaChart size={200} />
          </div>
          <CardContent className="p-8 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-primary-foreground/80" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-black opacity-80">AI Insights Available</span>
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">Generate Custom Report</h3>
              <p className="text-sm font-medium opacity-80 max-w-sm">
                Get a detailed breakdown of your spending habits and income sources for any specific date range.
              </p>
            </div>
            <Button className="shrink-0 rounded-[1.25rem] h-14 px-8 font-black tracking-wide uppercase text-xs bg-white text-primary hover:bg-white/90 shadow-lg group">
              <Plus size={18} strokeWidth={3} className="mr-2 group-hover:rotate-90 transition-transform" /> Create Report
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-4 w-full">
            Recent Reports
            <div className="h-[1px] flex-1 bg-border/40"></div>
          </h3>
          <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground">
            <Filter size={14} className="mr-1.5" /> Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORTS.map((report, i) => (
            <motion.div 
              key={report.name} 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 + (i * 0.05) }}
            >
              <Card className="border-border/40 hover:shadow-lg transition-all cursor-pointer shadow-sm bg-card/60 backdrop-blur-xl rounded-[1.5rem] group overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className={cn(
                      "p-4 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform",
                      report.status === 'Generated' ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted text-muted-foreground border border-border/50"
                    )}>
                      <FileText size={28} strokeWidth={2.5} />
                    </div>
                    <Badge variant="outline" className={cn(
                      "font-black uppercase tracking-widest text-[9px] px-2.5 py-1 border-border/60",
                      report.type === 'Monthly' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : 
                      report.type === 'Weekly' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : 
                      "bg-purple-500/10 text-purple-500 border-purple-500/20"
                    )}>
                      {report.type}
                    </Badge>
                  </div>
                  
                  <h4 className="font-black text-lg mb-1.5 tracking-tight line-clamp-1">{report.name}</h4>
                  
                  <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-2 mb-6">
                    <Calendar size={14} className="opacity-50" /> {report.date}
                  </p>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-border/40">
                    <Button variant="secondary" className="flex-1 h-10 text-[10px] uppercase font-black tracking-widest bg-muted hover:bg-muted/80 rounded-xl">
                      <Download size={14} className="mr-2" strokeWidth={2.5} /> Download
                    </Button>
                    <Button variant="outline" size="icon" className="shrink-0 h-10 w-10 border-border/60 bg-transparent hover:bg-muted rounded-xl">
                      <Share2 size={16} className="text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Empty Slot / View All */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (REPORTS.length * 0.05) }}>
             <Card className="h-full min-h-[220px] border-border/40 border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer shadow-sm bg-card/30 backdrop-blur-xl rounded-[1.5rem] group flex items-center justify-center">
              <CardContent className="p-6 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4 group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                  <ChevronRight size={32} strokeWidth={2} />
                </div>
                <h4 className="font-black text-lg tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">View Archive</h4>
                <p className="text-xs font-medium text-muted-foreground/60 mt-1">See all past reports</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
