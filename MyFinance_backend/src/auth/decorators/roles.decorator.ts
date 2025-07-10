// myfinance-app/backend/src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum'; // Importe o enum UserRole

export const ROLES_KEY = 'roles'; // Chave para armazenar os metadados dos papéis

// Este decorator receberá os papéis permitidos para uma rota
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);