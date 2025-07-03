// myfinance-app/backend/src/auth/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Garante que o email seja único
  email: string;

  @Column()
  password: string; // Armazenaremos o hash da senha aqui
}