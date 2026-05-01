/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const CURRENCY_SYMBOL = '৳';

export const INCOME_CATEGORIES = {
  'Tuition Income': ['Student-1', 'Student-2', 'Student-3', 'Batch Tuition', 'Tuition Due Paid'],
  'Family / Allowance': ['Home Allowance', 'Pocket Money'],
  'Freelance / Side Income': ['Online Work', 'Project', 'Others'],
  'Gift / Bonus': ['Eid Gift', 'Bonus', 'Others'],
  'Refund / Return': ['Cashback', 'Returned Money'],
};

export const EXPENSE_CATEGORIES = {
  'Food / Cooking': ['Rice-Dal-Oil', 'Vegetables', 'Fish-Meat-Egg', 'Spices', 'Gas/Cylinder', 'Tea/Snacks', 'Eating Out', 'Drinking Water', 'Market Cost'],
  'Transport': ['University Travel', 'Tuition Travel', 'Rickshaw/Auto', 'Bus/Train', 'Emergency Travel'],
  'Education': ['Semester Fee', 'Exam Fee', 'Books', 'Notes/Photocopy', 'Stationery', 'Online Course', 'Form Fill-up'],
  'Mobile / Internet': ['Mobile Recharge', 'Internet Package', 'WiFi Bill', 'App Subscription'],
  'Living / Room': ['Rent', 'Electricity', 'Gas/Utility', 'Room Items', 'Cleaning Items', 'Laundry'],
  'Tuition Work Expense': ['Board Marker/Pen', 'Print/Photocopy', 'Student Sheet', 'Teaching Materials', 'Tuition Travel'],
  'Shopping / Personal': ['Clothing', 'Shoes', 'Bag', 'Grooming', 'Personal Care'],
  'Health': ['Medicine', 'Doctor', 'Hospital', 'Emergency Health'],
  'Social / Friends': ['Hangout', 'Treat', 'Gift', 'Event', 'University Program'],
  'Entertainment / Culture': ['Movie', 'Music', 'Books', 'Apps', 'Game/Fun'],
  'Savings': ['Monthly Savings', 'Emergency Fund', 'Laptop/Phone Fund', 'Course Fund'],
  'Other / Mistake': ['Unknown', 'Lost Money', 'Extra Charge', 'Mistake Entry'],
};

export const ACCOUNTS_INITIAL = [
  { name: 'Cash in Hand', type: 'cash', icon: 'Wallet' },
  { name: 'bKash', type: 'mobile_money', icon: 'Smartphone' },
  { name: 'Nagad', type: 'mobile_money', icon: 'Smartphone' },
  { name: 'Bank Account', type: 'bank', icon: 'Building2' },
  { name: 'Emergency Savings', type: 'savings', icon: 'ShieldCheck' },
  { name: 'Tuition Due', type: 'liability', icon: 'CalendarClock' },
];
