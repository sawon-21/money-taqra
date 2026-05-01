/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Transaction, SyncStatus } from '../types';

function getLocalTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem('moneytaqra_transactions');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalTransactions(transactions: Transaction[]) {
  try {
    localStorage.setItem('moneytaqra_transactions', JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial data
    const localData = getLocalTransactions();
    // Sort by date desc
    localData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTransactions(localData);
    setLoading(false);
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'syncStatus' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newTrans: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      userId: 'local-user',
      syncStatus: SyncStatus.OFFLINE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTransactions(prev => {
      const updated = [newTrans, ...prev];
      updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      saveLocalTransactions(updated);
      return updated;
    });
  };

  const deleteTransaction = async (id: string) => {
    setTransactions(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveLocalTransactions(updated);
      return updated;
    });
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => {
      const updated = prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      });
      saveLocalTransactions(updated);
      return updated;
    });
  };

  return { transactions, loading, addTransaction, deleteTransaction, updateTransaction };
}
