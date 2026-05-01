/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { X, Save, ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, CURRENCY_SYMBOL } from '../../constants';
import { useTransactions } from '../../services/transactions';
import { cn } from '@/lib/utils';
import { CreatedBy, Transaction } from '../../types';

interface AddTransactionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionToEdit?: Transaction | null;
  initialData?: Partial<Transaction> | null;
}

export default function AddTransaction({ open, onOpenChange, transactionToEdit, initialData }: AddTransactionProps) {
  const { addTransaction, updateTransaction } = useTransactions();
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [account, setAccount] = useState('Cash');
  const [toAccount, setToAccount] = useState('bKash');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (transactionToEdit && open) {
      setType(transactionToEdit.type);
      setAmount(String(transactionToEdit.amount));
      setCategory(transactionToEdit.category);
      setSubcategory(transactionToEdit.subcategory);
      setAccount(transactionToEdit.accountId || 'Cash');
      setToAccount(transactionToEdit.toAccountId || 'bKash');
      setNote(transactionToEdit.note || '');
      setDate(transactionToEdit.date.split('T')[0]);
    } else if (initialData && open && !transactionToEdit) {
      setType(initialData.type || 'expense');
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setCategory(initialData.category || '');
      setSubcategory(initialData.subcategory || '');
      setAccount(initialData.accountId || 'Cash');
      setToAccount(initialData.toAccountId || 'bKash');
      setNote(initialData.note || '');
      setDate(initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]);
    } else if (open && !transactionToEdit && !initialData) {
      setType('expense');
      setAmount('');
      setCategory('');
      setSubcategory('');
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [transactionToEdit, initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !subcategory) return;

    if (transactionToEdit) {
      await updateTransaction(transactionToEdit.id, {
        type,
        amount: Number(amount),
        category,
        subcategory,
        accountId: account,
        toAccountId: type === 'transfer' ? toAccount : undefined,
        note,
        date,
      });
    } else {
      await addTransaction({
        type,
        amount: Number(amount),
        category,
        subcategory,
        accountId: account,
        toAccountId: type === 'transfer' ? toAccount : undefined,
        note,
        date,
        createdBy: CreatedBy.MANUAL
      });
    }

    onOpenChange(false);
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-t-3xl sm:rounded-3xl border-none bg-background shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">Add Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div className="flex bg-muted p-1 rounded-2xl">
            {(['expense', 'income', 'transfer'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all capitalize",
                  type === t 
                    ? "bg-background shadow-sm text-primary" 
                    : "text-muted-foreground hover:bg-background/20"
                )}
              >
                {t === 'expense' && <ArrowUpRight size={14} />}
                {t === 'income' && <ArrowDownLeft size={14} />}
                {t === 'transfer' && <ArrowRightLeft size={14} />}
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-muted-foreground/30">{CURRENCY_SYMBOL}</span>
              <Input
                type="number"
                placeholder="0.00"
                className="text-4xl font-bold border-none bg-transparent h-auto p-0 focus-visible:ring-0 placeholder:text-muted-foreground/20"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Category</label>
                <Select value={category} onValueChange={(val) => { setCategory(val); setSubcategory(''); }}>
                  <SelectTrigger className="rounded-xl bg-muted/30 border-border/50">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categories).map((catName) => (
                      <SelectItem key={catName} value={catName}>{catName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Subcategory</label>
                <Select value={subcategory} onValueChange={setSubcategory}>
                  <SelectTrigger className="rounded-xl bg-muted/30 border-border/50">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {category && (categories as any)[category]?.map((s: string) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  {type === 'transfer' ? 'From Account' : 'Account'}
                </label>
                <Select value={account} onValueChange={setAccount}>
                  <SelectTrigger className="rounded-xl bg-muted/30 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash in Hand</SelectItem>
                    <SelectItem value="bKash">bKash</SelectItem>
                    <SelectItem value="Nagad">Nagad</SelectItem>
                    <SelectItem value="Bank">Bank Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {type === 'transfer' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">To Account</label>
                  <Select value={toAccount} onValueChange={setToAccount}>
                    <SelectTrigger className="rounded-xl bg-muted/30 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash in Hand</SelectItem>
                      <SelectItem value="bKash">bKash</SelectItem>
                      <SelectItem value="Nagad">Nagad</SelectItem>
                      <SelectItem value="Bank">Bank Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {type !== 'transfer' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Date</label>
                  <Input 
                    type="date" 
                    className="rounded-xl bg-muted/30 border-border/50 h-10" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Note (Optional)</label>
              <Input
                placeholder="Market shopping, tea break etc."
                className="rounded-xl bg-muted/30 border-border/50 h-12"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 gap-2 mt-4">
            <Save size={20} /> Save Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
