/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Bot, Check, X, Loader2, Sparkles, ChevronLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { parseTransaction } from '../../services/gemini';
import { CURRENCY_SYMBOL } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTransactions } from '../../services/transactions';
import { useChatHistory, ChatMessage } from '../../services/chat';
import { CreatedBy } from '../../types';
import { useLocation } from 'wouter';
import AddTransaction from '../transactions/AddTransaction';

export default function AIAssistant() {
  const [_, setLocation] = useLocation();
  const { transactions, addTransaction } = useTransactions();
  const { messages, loading: chatLoading, addMessage } = useChatHistory();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [addOpen, setAddOpen] = useState(false);
  const [quickActionData, setQuickActionData] = useState<any>(null);

  const autoSave = localStorage.getItem('autoSaveAI') === 'true';
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (input === '' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input]);

  const detectDuplicates = (newTrans: any) => {
    return transactions.some(t => 
      t.amount === newTrans.amount && 
      t.category === newTrans.category && 
      t.date.startsWith(newTrans.date)
    );
  };

  const handleSend = async (text?: string) => {
    const rawContent = text || input;
    if (!rawContent.trim()) return;

    await addMessage({ role: 'user', content: rawContent });
    setInput('');
    setLoading(true);

    try {
      const result = await parseTransaction(rawContent);
      const { transactions: parsedTrans, message: aiMsg, warnings } = result;

      // Ensure parsedTrans is an array
      const safeTrans = Array.isArray(parsedTrans) ? parsedTrans : [];
      const highConfidence = safeTrans.every((t: any) => t.confidence >= 0.8) && safeTrans.length > 0;
      
      const contentStr = aiMsg || (safeTrans.length > 0 
        ? `আমি ${safeTrans.length} টি লেনদেন পেয়েছি।` 
        : 'দুঃখিত, আমি কোনো লেনদেন খুঁজে পাইনি।');

      const assistantMsg: Omit<ChatMessage, "id" | "createdAt"> = {
        role: 'assistant',
        content: contentStr,
        transactions: safeTrans,
        warnings,
        isParsed: true
      };

      await addMessage(assistantMsg);

      if (autoSave && highConfidence && (!warnings || warnings.length === 0)) {
        for (const t of safeTrans) {
          await addTransaction({
            type: t.type || 'expense',
            amount: Number(t.amount) || 0,
            category: t.category || 'Other',
            subcategory: t.subcategory || 'General',
            accountId: t.fromAccount || t.account || 'Cash in Hand',
            note: t.note || '',
            date: t.date || new Date().toISOString().split('T')[0],
            createdBy: CreatedBy.AI
          });
        }
        await addMessage({ role: 'assistant', content: '✅ সবগুলো সেভ করা হয়েছে!' });
      }
    } catch (error) {
      await addMessage({ role: 'assistant', content: 'দুঃখিত, আমি বুঝতে পারিনি। আবার বলুন।' });
    } finally {
      setLoading(false);
    }
  };

  const saveTransactions = async (trans: any[]) => {
    try {
      for (const t of trans) {
        await addTransaction({
           type: t.type || 'expense',
           amount: Number(t.amount) || 0,
           category: t.category || 'Other',
           subcategory: t.subcategory || 'General',
           accountId: t.fromAccount || t.account || 'Cash in Hand',
           note: t.note || '',
           date: t.date || new Date().toISOString().split('T')[0],
           createdBy: CreatedBy.AI
        });
      }
      await addMessage({ role: 'assistant', content: 'সবগুলো লেনদেন সফলভাবে সেভ করা হয়েছে! ✅' });
    } catch (e) {
      await addMessage({ role: 'assistant', content: 'সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support voice input.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'bn-BD';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };
    recognition.start();
  };

  return (
    <div className="flex flex-col absolute inset-0 z-50 lg:z-10 bg-background text-foreground overflow-hidden">
      {/* ChatGPT-style Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/40 bg-background/95 backdrop-blur shrink-0 z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={() => setLocation('/')}>
            <ChevronLeft size={24} />
          </Button>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg tracking-tight">Ava <span className="opacity-50">Assistant</span></span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto w-full custom-scrollbar" id="chat-container">
        <div className="max-w-3xl mx-auto w-full pt-6 pb-6">
          {chatLoading && (
            <div className="flex items-center justify-center py-10 opacity-50">
              <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
          )}
          
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                key={msg.id || i}
                className={cn(
                  "w-full flex px-4 sm:px-6 py-6 group",
                  msg.role === 'assistant' ? "bg-muted/30" : ""
                )}
              >
                <div className="flex gap-4 sm:gap-6 w-full max-w-3xl mx-auto">
                  <div className="shrink-0 mt-0.5">
                    {msg.role === 'assistant' ? (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                        <Sparkles size={16} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                        U
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-4">
                    <p className="font-medium leading-relaxed whitespace-pre-wrap text-[15px] sm:text-[16px] text-foreground">
                      {msg.content}
                    </p>
                    
                    {msg.warnings && msg.warnings.length > 0 && (
                      <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                        {msg.warnings.map((w, idx) => (
                          <p key={idx} className="text-sm text-orange-600 dark:text-orange-400 font-medium flex items-start gap-2">
                            <span>⚠️</span> {w}
                          </p>
                        ))}
                      </div>
                    )}

                    {msg.transactions && msg.transactions.length > 0 && (
                      <div className="mt-6 flex flex-col gap-4">
                        {msg.transactions.map((t: any, idx: number) => {
                          const isDup = detectDuplicates(t);
                          const isLowConfidence = t.confidence < 0.7;
                          
                          return (
                            <div 
                              key={idx} 
                              className={cn(
                                "bg-background p-4 sm:p-5 rounded-2xl border transition-all shadow-sm relative group/item",
                                isDup ? "border-amber-500/50" : 
                                isLowConfidence ? "border-blue-500/50" : "border-border"
                              )}
                            >
                              {!autoSave && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity bg-muted/50 rounded-xl"
                                  onClick={() => {
                                    setQuickActionData(t);
                                    setAddOpen(true);
                                  }}
                                >
                                  <Pencil size={14} className="text-muted-foreground" />
                                </Button>
                              )}
                              <div className="flex flex-wrap items-center justify-between gap-4 mb-3 pr-8">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center",
                                    t.type === 'income' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                  )}>
                                    <span className="text-lg font-bold">{t.type === 'income' ? '+' : '-'}</span>
                                  </div>
                                  <div>
                                    <span className={cn(
                                      "text-xl sm:text-2xl font-bold tracking-tight",
                                      t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                                    )}>
                                      {CURRENCY_SYMBOL}{t.amount?.toLocaleString()}
                                    </span>
                                  </div>
                                  {isDup && <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-600 bg-amber-500/10">Duplicate?</Badge>}
                                </div>
                                <Badge variant="outline" className="text-xs uppercase bg-muted/50 text-muted-foreground border-transparent">
                                  {t.fromAccount || t.account || 'Cash in Hand'}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/50">
                                <div>
                                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Category</p>
                                  <p className="text-sm font-medium">
                                    {t.category} <span className="opacity-40 px-1">•</span> {t.subcategory}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Note</p>
                                  <p className="text-sm font-medium text-muted-foreground italic">
                                    {t.note || 'No note provided'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {!autoSave && (
                          <div className="flex flex-wrap sm:flex-nowrap gap-3 mt-2">
                            <Button 
                              className="flex-1 rounded-xl font-semibold shadow-sm" 
                              onClick={() => saveTransactions(msg.transactions!)}
                            >
                              <Check className="w-4 h-4 mr-2" /> Save Records
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1 rounded-xl font-semibold" 
                              onClick={() => addMessage({ role: 'assistant', content: 'ঠিক আছে, বাতিল করা হলো।' })}
                            >
                              <X className="w-4 h-4 mr-2" /> Ignore
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full flex px-4 sm:px-6 py-6 bg-muted/30">
               <div className="flex gap-4 sm:gap-6 w-full max-w-3xl mx-auto">
                 <div className="shrink-0 mt-0.5">
                   <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                     <Sparkles size={16} className="animate-spin-slow" />
                   </div>
                 </div>
                 <div className="flex-1 flex items-center gap-1.5 h-8">
                   <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                   <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                   <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></span>
                 </div>
               </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ChatGPT-style Input Box */}
      <div className="shrink-0 pt-4 pb-4 sm:pb-6 px-4 z-20 bg-background border-t border-border/20">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative flex items-end gap-2 p-2 bg-background border border-border rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
            <Button 
              size="icon" 
              variant="ghost"
              className={cn(
                "shrink-0 rounded-xl h-10 w-10 sm:h-12 sm:w-12 transition-all duration-300 self-end", 
                isListening 
                  ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 hover:text-rose-600 animate-pulse" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={handleVoiceInput}
            >
              <Mic className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 py-2 sm:py-3 max-h-32 overflow-y-auto custom-scrollbar">
              <textarea
                ref={textareaRef}
                placeholder="Message Ava..." 
                className="w-full bg-transparent outline-none resize-none text-[15px] sm:text-[16px] placeholder:text-muted-foreground min-h-[24px] leading-relaxed block"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                style={{ height: "auto" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
              />
            </div>

            <Button 
              size="icon" 
              className={cn(
                "shrink-0 rounded-xl h-10 w-10 sm:h-12 sm:w-12 transition-all self-end",
                input.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"
              )}
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />
            </Button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] sm:text-xs text-muted-foreground opacity-60">Ava can make mistakes. Verify important transactions.</p>
          </div>
        </div>
      </div>

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
    </div>
  );
}
