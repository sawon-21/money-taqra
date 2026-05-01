/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'income' | 'expense' | 'transfer';

export enum SyncStatus {
  SYNCED = 'synced',
  OFFLINE = 'offline',
  PENDING = 'pending'
}

export enum CreatedBy {
  MANUAL = 'manual',
  AI = 'ai',
  VOICE = 'voice'
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  date: string; // ISO string
  accountId: string;
  toAccountId?: string; // for transfers
  category: string;
  subcategory: string;
  note?: string;
  paymentMethod?: string;
  tags?: string[];
  receiptUrl?: string;
  createdBy: CreatedBy;
  syncStatus: SyncStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'mobile_money' | 'savings' | 'liability';
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
}

export interface TuitionStudent {
  id: string;
  name: string;
  monthlyFee: number;
  status: 'active' | 'inactive';
  paymentHistory: {
    month: string;
    amount: number;
    date: string;
    status: 'paid' | 'partial' | 'due';
  }[];
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  month: string; // YYYY-MM
}

export interface UserSettings {
  language: 'bn' | 'en' | 'banglish';
  currency: string;
  darkMode: boolean;
  autoSaveAI: boolean;
}
