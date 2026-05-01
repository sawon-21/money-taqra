/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  transactions?: any[];
  warnings?: string[];
  isParsed?: boolean;
  createdAt: string;
}

function getLocalChatHistory(): ChatMessage[] {
  try {
    const data = localStorage.getItem('moneytaqra_chat');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalChatHistory(messages: ChatMessage[]) {
  try {
    localStorage.setItem('moneytaqra_chat', JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save chat to local storage', e);
  }
}

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getLocalChatHistory();
    
    // Add default welcome message if empty
    if (data.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: 'হ্যালো! আমি MoneyTaqra AI। আপনি কি খরচ বা আয় যোগ করতে চান? টাইপ করুন বা মাইক্রোফোন ব্যবহার করুন।',
        createdAt: new Date().toISOString()
      }]);
    } else {
      setMessages(data);
    }
    setLoading(false);
  }, []);

  const addMessage = async (msg: Omit<ChatMessage, 'id' | 'createdAt'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => {
      const updated = [...prev, newMsg];
      saveLocalChatHistory(updated);
      return updated;
    });
  };

  return { messages, loading, addMessage };
}
