// myfinance-app/backend/src/transactions/entities/transaction.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { text } from 'stream/consumers';

export enum TransactionType { // Garanta que 'export' está aqui
  INCOME = 'income',
  EXPENSE = 'expense',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @Column({ type: 'date' })
  date: string;

  @Column({
    type: 'text', // Corrigido para 'text'
    enum: TransactionType,
  })
  type: TransactionType;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null; // <-- DEVE SER 'string | null'

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  user?: User;

  @Column()
  userId: number;

  @ManyToOne(() => Category, (category) => category.transactions, { onDelete: 'SET NULL', nullable: true })
  category?: Category | null; // <-- DEVE SER 'Category | null'

  @Column({ nullable: true })
  categoryId: number | null;
}