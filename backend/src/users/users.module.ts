// myfinance-app/backend/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../auth/entities/user.entity'; // Importe a entidade User
import { AuthModule } from '../auth/auth.module'; // Importe o AuthModule para acessar o Passport/JWT/UserRole

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Permite que UsersModule interaja com a entidade User
    AuthModule, // Importe AuthModule para usar guards e estratégias definidos lá
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exporte o serviço se ele for usado em outros módulos
})
export class UsersModule {}