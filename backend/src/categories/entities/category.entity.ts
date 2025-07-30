// myfinance-app/backend/src/categories/entities/category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'; // Importe OneToMany
import { User } from '../../auth/entities/user.entity';
import { Transaction } from '../../transactions/entities/transaction.entity'; // <-- NOVO: Importe a entidade Transaction

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  color: string;

  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  user?: User;

  @Column()
  userId: number;

  @OneToMany(() => Transaction, (transaction) => transaction.category) // <-- NOVO: Uma categoria tem muitas transações
  transactions: Transaction[]; // Uma coleção de transações que usam esta categoria
}