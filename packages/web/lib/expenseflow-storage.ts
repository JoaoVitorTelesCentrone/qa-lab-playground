import{expenseSeed,type Expense}from"@/data/expenseflow";
const KEY="qa-lab-expenseflow-v1";
export function loadExpenses():Expense[]{if(typeof window==="undefined")return expenseSeed;try{const value=localStorage.getItem(KEY);return value?JSON.parse(value):expenseSeed}catch{return expenseSeed}}
export function saveExpenses(value:Expense[]){localStorage.setItem(KEY,JSON.stringify(value))}
export function resetExpenses(){localStorage.removeItem(KEY);return expenseSeed.map(item=>({...item}))}
