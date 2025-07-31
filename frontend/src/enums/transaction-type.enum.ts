export const TransactionType = {
  INCOME: 'INCOME',
  OUTCOME: 'OUTCOME',
} as const;

// Se precisar dos tipos, já estão disponíveis:
export type TransactionType = typeof TransactionType[keyof typeof TransactionType];
