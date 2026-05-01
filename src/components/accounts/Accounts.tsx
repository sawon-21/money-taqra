/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wallet, Smartphone, Building2, ShieldCheck, CalendarClock, MoreVertical, Plus, Landmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CURRENCY_SYMBOL } from '../../constants';
import { motion } from 'framer-motion';
import { useTransactions } from '../../services/transactions';
import { useMemo } from 'react';

export default function Accounts() {
  const { transactions } = useTransactions();

  const accountStats = useMemo(() => {
    const defaultStats: Record<string, number> = {
      'Cash': 0,
      'bKash': 0,
      'Nagad': 0,
      'Bank': 0
    };

    transactions.forEach(t => {
      const amount = Number(t.amount);
      const mainAcc = t.accountId || 'Cash';
      if (t.type === 'income') {
        defaultStats[mainAcc] = (defaultStats[mainAcc] || 0) + amount;
      } else if (t.type === 'expense') {
        defaultStats[mainAcc] = (defaultStats[mainAcc] || 0) - amount;
      } else if (t.type === 'transfer') {
        defaultStats[mainAcc] = (defaultStats[mainAcc] || 0) - amount;
        if (t.toAccountId) {
          defaultStats[t.toAccountId] = (defaultStats[t.toAccountId] || 0) + amount;
        }
      }
    });

    return [
      { name: 'Cash', type: 'cash', icon: Wallet, balance: defaultStats['Cash'], color: 'bg-orange-500' },
      { name: 'bKash', type: 'mobile_money', icon: Smartphone, balance: defaultStats['bKash'], color: 'bg-pink-500' },
      { name: 'Nagad', type: 'mobile_money', icon: Smartphone, balance: defaultStats['Nagad'], color: 'bg-red-500' },
      { name: 'Bank Account', type: 'bank', icon: Landmark, balance: defaultStats['Bank'], color: 'bg-blue-500' },
    ];
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Accounts</h2>
          <p className="text-muted-foreground text-sm">Where your money lives 🏦</p>
        </div>
        <Button className="rounded-full shadow-lg">
          <Plus size={18} className="mr-2" /> New Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accountStats.map((acc, i) => {
          const Icon = acc.icon;
          return (
            <motion.div
              key={acc.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border/50 group hover:border-primary transition-all shadow-sm bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${acc.color} text-white shadow-lg`}>
                      <Icon size={24} />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreVertical size={18} />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{acc.name}</h3>
                    <p className="text-3xl font-extrabold tracking-tight mt-1">
                      {CURRENCY_SYMBOL} {acc.balance.toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold flex-1">Transfer</Button>
                    <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold flex-1">History</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
