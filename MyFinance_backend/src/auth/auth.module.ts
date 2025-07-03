// myfinance-app/backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt'; // Importe o JwtModule
import { PassportModule } from '@nestjs/passport'; // Importe o PassportModule

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configura o Passport para usar JWT por padrão
    JwtModule.register({
      secret: 'superSecretKey123', // ATENÇÃO: Use uma variável de ambiente em produção!
      signOptions: {
        expiresIn: 3600, // O token expira em 1 hora (em segundos)
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, PassportModule, JwtModule], // Exporte para que outros módulos possam usar JWT
})
export class AuthModule {}