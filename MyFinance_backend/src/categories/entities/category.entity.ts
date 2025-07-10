// myfinance-app/backend/src/categories/entities/category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'; // Importe ManyToOne
import { User } from '../../auth/entities/user.entity'; // Importe a entidade User

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Coluna para cor da categoria (opcional, mas bom para o frontend)
  @Column({ nullable: true })
  color: string; // Ex: '#FF0000'

  // Relacionamento Many-to-One com User: Muitas categorias para um usuário
  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' }) // onDelete: 'CASCADE' deleta categorias se o usuário for deletado
  user?: User; // A instância do usuário à qual esta categoria pertence

  @Column()
  userId: number; // A coluna que armazena o ID do usuário no banco de dados
}