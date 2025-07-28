export interface Receivable {
  referenceNumber: string;
  date: string;
  amount: number;
  remark: string;
}

export interface Expense {
  name: string;
  amount: number;
}

export interface Fund {
  caseNumber: string;
  goalAmount: number;
  receivables: Receivable[];
  expenses: Expense[];
}