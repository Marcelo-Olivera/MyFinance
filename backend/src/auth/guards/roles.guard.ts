// myfinance-app/backend/src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Importe Reflector
import { UserRole } from '../enums/user-role.enum'; // Importe o enum UserRole
import { ROLES_KEY } from '../decorators/roles.decorator'; // Futuro decorator, vamos criar já

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // Injeta o Reflector

  canActivate(context: ExecutionContext): boolean {
    // 1. Obter os papéis necessários para a rota
    // O Reflector nos ajuda a ler metadados definidos por decorators (@SetMetadata ou @Roles)
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(), // Obtém metadados do método (ex: @Get('/admin'))
      context.getClass(),    // Obtém metadados da classe (ex: @Controller('admin'))
    ]);

    // Se não houver papéis definidos para a rota, qualquer usuário autenticado pode acessá-la
    if (!requiredRoles) {
      return true;
    }

    // 2. Obter o usuário autenticado (que foi anexado por JwtAuthGuard)
    // O `req.user` vem do Express. Para tipagem correta, você pode precisar instalar:
    // npm install -D @types/express
    const { user } = context.switchToHttp().getRequest();

    // 3. Verificar se o usuário possui pelo menos um dos papéis necessários
    return requiredRoles.some((role) => user.role === role);
    // Ou, se o usuário puder ter múltiplos papéis:
    // return requiredRoles.some((role) => user.roles?.includes(role));
  }
}