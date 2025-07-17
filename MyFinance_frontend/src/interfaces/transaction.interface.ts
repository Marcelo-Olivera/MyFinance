// myfinance-app/frontend/src/interfaces/transaction.interface.ts
import type { CategoryData } from './category.interface'; // Importe o tipo CategoryData
import { TransactionType } from '../enums/transaction-type.enum'; // Importe o enum TransactionType

export interface TransactionData {
  id: number;
  amount: number;
  description: string;
  date: string; // AAAA-MM-DD
  type: TransactionType;
  createdAt: string; // Data e hora de criação
  notes: string | null;
  userId: number;
  categoryId: number | null;
  category?: CategoryData | null; // Usará a interface CategoryData do arquivo compartilhado
}