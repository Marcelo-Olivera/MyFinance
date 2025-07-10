// myfinance-app/backend/src/auth/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'; // Importe OneToMany
import { UserRole } from '../enums/user-role.enum';
import { Category } from '../../categories/entities/category.entity'; // Importe a entidade Category

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // Relacionamento One-to-Many com Category: Um usuário tem muitas categorias
  @OneToMany(() => Category, (category) => category.user) // user.categories é o nome da propriedade no User que terá as categorias
  categories: Category[]; // Uma coleção de categorias que pertencem a este usuário
}