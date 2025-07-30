// myfinance-app/backend/src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UserRole } from '../auth/enums/user-role.enum'; // Importe o enum UserRole

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    // Retorna todos os usuários, mas excluindo a senha por segurança
    // Você pode adicionar paginação e filtros aqui no futuro
    return this.usersRepository.find({
      select: ['id', 'email', 'role'], // Seleciona apenas os campos que queremos expor
    });
  }

  async deleteUser(id: number): Promise<void> {
    // Não permite que um ADMIN delete a si mesmo ou outro ADMIN sem uma lógica mais robusta
    // Por simplicidade, vamos permitir que um ADMIN delete qualquer USER.
    // Uma lógica mais avançada poderia ser:
    // 1. Não permitir que um ADMIN delete outro ADMIN.
    // 2. Não permitir que um ADMIN delete a si mesmo.

    const userToDelete = await this.usersRepository.findOneBy({ id });

    if (!userToDelete) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
    }

    // Exemplo de regra: Não permitir deletar o único ADMIN ou o próprio ADMIN logado
    // (Isso seria feito no Controller, que tem acesso ao usuário logado)

    // Por enquanto, apenas deleta se encontrado
    await this.usersRepository.delete(id);
  }
}