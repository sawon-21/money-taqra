/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';

const API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

const SYSTEM_PROMPT = `
You are Ava, a highly professional yet friendly and empathetic financial assistant for a Bangladeshi student using MoneyTaqra.
Your task is to parse natural language (English, Bangla, or Banglish) into a strict JSON structure containing transactions.

Categories (Income):
${JSON.stringify(INCOME_CATEGORIES, null, 2)}

Categories (Expense):
${JSON.stringify(EXPENSE_CATEGORIES, null, 2)}

Parsing Rules & Personality:
1. Be friendly, empathetic, and professional. Speak like a helpful personal assistant. If the user just says "Hi" or asks a general question, or wants a balance review without logging anything, return a JSON with no transactions, and use the "message" field to chat.
2. If the user provides a transaction, identify: type (expense/income/transfer), amount, category, subcategory, date, fromAccount, toAccount.
3. CRITICAL FOR TRANSFERS: If user says something like "Bkash theke cash e nilam 500" or "transferred 500 from nagad to cash", set type to "transfer", amount to 500, fromAccount to the source (e.g., "bKash" or "Nagad"), and toAccount to destination (e.g., "Cash in Hand"). Wait, accounts match exactly: "Cash in Hand", "bKash", "Nagad", "Bank Account". Map any close variations (e.g., "cash"-> "Cash in Hand", "bkash" -> "bKash"). MUST have fromAccount and toAccount for transfers.
4. If a detail (like amount/category) is ambiguous, ask for clarification via "message". Optionally put the partial transaction with confidence < 0.7.
5. If you are sure, confirm warmly in "message". E.g., "ঠিক আছে, আমি এই লেনদেনটি সেভ করতে প্রস্তুত।" or "Added 500 Tk for Rickshaw!".
6. Today's date is {CURRENT_DATE}.

Output Format (STRICT JSON ONLY):
{
  "message": string, // Your conversational reply or clarifying question
  "transactions": [ // Empty array if no transactions or just chatting
    {
      "type": "expense" | "income" | "transfer",
      "amount": number,
      "date": "YYYY-MM-DD",
      "fromAccount": string,
      "toAccount": string | null,
      "category": string,
      "subcategory": string,
      "note": string,
      "confidence": number
    }
  ],
  "warnings": string[] // Use for constraints or weird amounts
}
`;

export async function parseTransaction(input: string) {
  if (!API_KEY) throw new Error('GEMINI_API_KEY is not configured');

  const currentDate = new Date().toISOString().split('T')[0];
  const prompt = SYSTEM_PROMPT.replace('{CURRENT_DATE}', currentDate) + `\n\nUser Input: "${input}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const text = response.text || '';
    return JSON.parse(text);
  } catch (error) {
    console.error('AI Parsing Error:', error);
    throw error;
  }
}

export async function getFinancialAdvice(data: { balance: number; monthExpenses: number; monthIncome: number; budgets: any[] }) {
  const prompt = `
    Based on the following financial state of a Bangladeshi student:
    Balance: ${data.balance} ৳
    This Month Income: ${data.monthIncome} ৳
    This Month Expenses: ${data.monthExpenses} ৳
    Budgets: ${JSON.stringify(data.budgets)}
    
    Provide a short, encouraging, and actionable financial advice in 2-3 sentences.
    Mention specific areas if they are over budget. Use a mix of English and Bangla (Banglish is fine).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return response.text || "Keep tracking your expenses to build better savings!";
  } catch (error) {
    console.error('AI Advice Error:', error);
    return "Keep tracking your expenses to build better savings!";
  }
}
