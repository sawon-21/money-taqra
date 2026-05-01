/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowRightLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  Loader2,
  Trash2,
  Edit2,
  Calendar,
  Tag,
  CreditCard,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CURRENCY_SYMBOL } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions } from '../../services/transactions';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import AddTransaction from './AddTransaction';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';

export default function Transactions() {
  const { transactions, loading, deleteTransaction } = useTransactions();
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null);

  const filteredTransactions = transactions.filter(t => 
    t.note?.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase()) ||
    t.subcategory.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filteredTransactions.reduce((acc: any, t) => {
    const date = t.date.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {});

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
      setSelectedTransaction(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
        <p className="text-muted-foreground text-sm font-medium">Reading your ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight font-heading">Ledger</h2>
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black opacity-60">History of your financial journey</p>
        </div>
        <Button 
          className="rounded-[1.25rem] shadow-lg shadow-primary/20 gap-2 h-12 px-6 font-bold"
          onClick={() => {
            setTransactionToEdit(null);
            setAddOpen(true);
          }}
        >
          <Plus size={18} strokeWidth={3} /> Add
        </Button>
      </div>

      <AddTransaction 
        open={addOpen} 
        onOpenChange={(isOpen) => {
          setAddOpen(isOpen);
          if (!isOpen) {
            setTransactionToEdit(null);
          }
        }} 
        transactionToEdit={transactionToEdit}
      />

      <div className="flex gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search notes, categories..." 
            className="pl-12 h-12 rounded-[1.25rem] border-border/40 bg-card/60 backdrop-blur-xl focus-visible:ring-primary/20 shadow-sm text-base font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="rounded-[1.25rem] h-12 w-12 border-border/40 bg-card/60 shadow-sm hover:bg-card/80">
          <Filter size={20} />
        </Button>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0])).map(([date, items]: any, groupIdx) => (
          <div key={date} className="space-y-4">
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2 flex items-center gap-4">
              {format(new Date(date), 'MMMM dd, yyyy')}
              <div className="h-[1px] flex-1 bg-border/40"></div>
            </h3>
            <div className="space-y-3">
              {items.map((t: any, i: number) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ delay: (groupIdx * 3 + i) * 0.03, type: "spring", stiffness: 400, damping: 30 }}
                >
                  <Card 
                    className="border-none hover:shadow-lg transition-all cursor-pointer group bg-card/60 backdrop-blur-xl relative overflow-hidden rounded-2xl"
                    onClick={() => setSelectedTransaction(t)}
                  >
                    <CardContent className="p-4 sm:p-5 flex items-center gap-4 sm:gap-5">
                      <div className={cn(
                        "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-inner",
                        t.type === 'expense' ? "bg-rose-500/10 text-rose-500" : 
                        t.type === 'income' ? "bg-emerald-500/10 text-emerald-500" :
                        "bg-blue-500/10 text-blue-500"
                      )}>
                        {t.type === 'expense' && <ArrowUpRight size={24} strokeWidth={2.5} />}
                        {t.type === 'income' && <ArrowDownLeft size={24} strokeWidth={2.5} />}
                        {t.type === 'transfer' && <ArrowRightLeft size={24} strokeWidth={2.5} />}
                      </div>
                      
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold truncate text-sm sm:text-base tracking-tight">{t.note || t.subcategory}</p>
                          <p className={cn(
                            "font-mono font-black text-base sm:text-lg tracking-tighter shrink-0 ml-4",
                            t.type === 'expense' ? "text-rose-500" : 
                            t.type === 'income' ? "text-emerald-500" :
                            "text-blue-500"
                          )}>
                            {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''}{CURRENCY_SYMBOL}{t.amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] sm:text-xs font-semibold text-muted-foreground opacity-80">{t.category} <span className="mx-1 opacity-50">•</span> {t.account}</p>
                          <div className="flex items-center gap-2">
                            {t.createdBy === 'AI' && <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-indigo-500/10 text-indigo-500 border-indigo-500/20 font-black tracking-wider uppercase">AI</Badge>}
                            <ChevronRight size={16} strokeWidth={3} className="text-muted-foreground opacity-0 group-hover:opacity-40 transition-opacity translate-x-2 group-hover:translate-x-0" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Transaction Details Sheet */}
      <Sheet open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-8 border-t border-border/40 bg-background/95 backdrop-blur-2xl">
          {selectedTransaction && (
            <>
              <SheetHeader className="mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-1.5 bg-border/40 rounded-full"></div>
                </div>
                <div className="flex justify-center mb-4">
                  <div className={cn(
                    "w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-2xl",
                    selectedTransaction.type === 'expense' ? "bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-rose-500/30" : 
                    selectedTransaction.type === 'income' ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/30" : 
                    "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-blue-500/30"
                  )}>
                    {selectedTransaction.type === 'expense' ? <ArrowUpRight size={40} strokeWidth={2.5} /> : 
                     selectedTransaction.type === 'income' ? <ArrowDownLeft size={40} strokeWidth={2.5} /> :
                     <ArrowRightLeft size={40} strokeWidth={2.5} />}
                  </div>
                </div>
                <SheetTitle className="text-center text-4xl font-black tracking-tighter mb-2">
                  <span className={cn(
                    selectedTransaction.type === 'expense' ? "text-rose-500" : 
                    selectedTransaction.type === 'income' ? "text-emerald-500" : "text-blue-500"
                  )}>
                    {selectedTransaction.type === 'income' ? '+' : '-'}{CURRENCY_SYMBOL}{selectedTransaction.amount.toLocaleString()}
                  </span>
                </SheetTitle>
                <SheetDescription className="text-center font-medium text-base">
                  {selectedTransaction.note || 'No note added'}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Card className="bg-card/50 border-border/40 shadow-sm p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-80">
                      <Tag size={14} /> Category
                    </div>
                    <div className="text-sm font-bold">{selectedTransaction.category}</div>
                    <div className="text-[11px] text-muted-foreground font-medium">{selectedTransaction.subcategory}</div>
                  </Card>
                  <Card className="bg-card/50 border-border/40 shadow-sm p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-80">
                      <CreditCard size={14} /> Account
                    </div>
                    <div className="text-sm font-bold">{selectedTransaction.account}</div>
                    {selectedTransaction.type === 'transfer' && (
                      <div className="text-[11px] text-muted-foreground font-medium">To: {selectedTransaction.toAccount}</div>
                    )}
                  </Card>
                </div>

                <div className="bg-card/50 border border-border/40 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2 font-black uppercase tracking-widest text-[10px] opacity-80">
                      <Calendar size={14} /> Date
                    </span>
                    <span className="font-bold text-sm tracking-tight">{format(new Date(selectedTransaction.date), 'PPPP')}</span>
                  </div>
                  <div className="h-[1px] bg-border/40"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2 font-black uppercase tracking-widest text-[10px] opacity-80">
                      <FileText size={14} /> Method
                    </span>
                    <span className="font-bold text-sm tracking-tight">{selectedTransaction.createdBy === 'AI' ? 'Parsed with AI' : 'Manual Entry'}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] border-border/60 hover:bg-muted bg-transparent"
                    onClick={() => {
                      setTransactionToEdit(selectedTransaction);
                      setAddOpen(true);
                      setSelectedTransaction(null);
                    }}
                  >
                    <Edit2 size={16} className="mr-2" /> Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-red-500/20 bg-rose-500 hover:bg-rose-600"
                    onClick={() => handleDelete(selectedTransaction.id)}
                  >
                    <Trash2 size={16} className="mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Function removed as it's now imported or handled locally
