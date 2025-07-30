// myfinance-app/backend/src/users/users.controller.ts
import { Controller, Get, Delete, Param, ParseIntPipe, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport'; // Importe AuthGuard
import { RolesGuard } from '../auth/guards/roles.guard'; // Importe RolesGuard
import { Roles } from '../auth/decorators/roles.decorator'; // Importe o decorator Roles
import { UserRole } from '../auth/enums/user-role.enum'; // Importe o enum UserRole

@Controller('users') // Prefixo para todas as rotas neste controller
@UseGuards(AuthGuard('jwt'), RolesGuard) // Aplica JwtAuthGuard e RolesGuard a TODAS as rotas neste controller
@Roles(UserRole.ADMIN) // Todas as rotas neste controller exigem o papel ADMIN
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content para deleção bem-sucedida
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    // Lógica de segurança adicional pode ser implementada aqui ou no serviço
    // Por exemplo: garantir que um admin não pode deletar a si mesmo.
    // Para isso, o controller precisaria do @GetUser() para obter o ID do admin logado.
    await this.usersService.deleteUser(id);
  }
}