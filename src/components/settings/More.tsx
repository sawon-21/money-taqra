/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  Database, 
  Download, 
  Upload, 
  Globe,
  SunMoon,
  Info,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function More() {
  const [autoSave, setAutoSave] = useState(localStorage.getItem('autoSaveAI') === 'true');
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('moneytaqra_theme') !== 'light';
  });

  const toggleAutoSave = (val: boolean) => {
    setAutoSave(val);
    localStorage.setItem('autoSaveAI', val ? 'true' : 'false');
  };

  const toggleTheme = (val: boolean) => {
    setIsDark(val);
    if (val) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('moneytaqra_theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('moneytaqra_theme', 'light');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: any = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-10">
      <motion.div variants={item} className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shadow-inner border border-primary/20">
              <User size={36} strokeWidth={2} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-background"></div>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">Student User</h2>
            <p className="text-muted-foreground font-medium mb-1.5">Offline Mode</p>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-black tracking-widest px-2 py-0.5">Local</Badge>
          </div>
        </div>
      </motion.div>

      <div className="space-y-8">
        <motion.div variants={item}>
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2 flex items-center gap-4 mb-4">
            Preferences
            <div className="h-[1px] flex-1 bg-border/40"></div>
          </h3>
          <Card className="border-border/40 bg-card/60 backdrop-blur-xl rounded-[1.5rem] shadow-sm overflow-hidden">
            <div className="divide-y divide-border/40">
              <div className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform"><Globe size={20} strokeWidth={2.5} /></div>
                  <span className="font-bold">Language (ভাষা)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-black uppercase tracking-widest">Banglish</span>
                  <ChevronRight size={16} className="text-muted-foreground/50" />
                </div>
              </div>
              <div className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl"><SunMoon size={20} strokeWidth={2.5} /></div>
                  <span className="font-bold">Dark Mode</span>
                </div>
                <Switch checked={isDark} onCheckedChange={toggleTheme} />
              </div>
              <div className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl"><Sparkles size={20} strokeWidth={2.5} /></div>
                  <div className="flex flex-col">
                    <span className="font-bold">Auto-save Trusted AI</span>
                    <span className="text-[11px] text-muted-foreground font-medium opacity-80 mt-0.5">Skip confirmation for clear inputs</span>
                  </div>
                </div>
                <Switch checked={autoSave} onCheckedChange={toggleAutoSave} />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2 flex items-center gap-4 mb-4">
            Data & Sync
            <div className="h-[1px] flex-1 bg-border/40"></div>
          </h3>
          <Card className="border-border/40 bg-card/60 backdrop-blur-xl rounded-[1.5rem] shadow-sm overflow-hidden">
            <div className="divide-y divide-border/40">
              <div className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Database size={20} strokeWidth={2.5} /></div>
                  <span className="font-bold">Offline Storage</span>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black uppercase tracking-widest text-[9px] px-2 py-0.5">Local</Badge>
              </div>
              <button className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-500/10 text-slate-500 rounded-2xl group-hover:scale-110 transition-transform"><Download size={20} strokeWidth={2.5} /></div>
                  <span className="font-bold">Export CSV/JSON</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0" />
              </button>
              <button className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-500/10 text-slate-500 rounded-2xl group-hover:scale-110 transition-transform"><Upload size={20} strokeWidth={2.5} /></div>
                  <span className="font-bold">Import Data</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0" />
              </button>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2 flex items-center gap-4 mb-4">
            Account
            <div className="h-[1px] flex-1 bg-border/40"></div>
          </h3>
          <Card className="border-border/40 bg-card/60 backdrop-blur-xl rounded-[1.5rem] shadow-sm overflow-hidden">
            <div className="divide-y divide-border/40">
              <button className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl group-hover:scale-110 transition-transform"><Info size={20} strokeWidth={2.5} /></div>
                  <span className="font-bold">About MoneyTaqra</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0" />
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
      
      <motion.p variants={item} className="text-center text-[10px] text-muted-foreground mt-12 mb-4 font-black tracking-widest uppercase opacity-60">
        MoneyTaqra v1.0.0
        <br/><span className="text-[9px] opacity-70 normal-case tracking-normal font-medium inline-block mt-2">Made with ❤️ in Dinajpur</span>
      </motion.p>
    </motion.div>
  );
}
