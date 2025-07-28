// myfinance-app/backend/src/transactions/entities/transaction.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
// ✅ Importa o enum TransactionType do arquivo dedicado
import { TransactionType } from '../enums/transaction-type.enum';

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
    type: 'text',
    enum: TransactionType, // ✅ Usa o enum importado
  })
  type: TransactionType;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  user?: User;

  @Column()
  userId: number;

  @ManyToOne(() => Category, (category) => category.transactions, { onDelete: 'SET NULL', nullable: true })
  category?: Category | null;

  @Column({ nullable: true })
  categoryId: number | null;
}