// myfinance-app/backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy'; // Importe sua estratégia JWT

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'superSecretKey123', // DEVE SER O MESMO SECRET!
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // Adicione sua estratégia JWT como um provider
  ],
  exports: [
    AuthService,
    PassportModule,
    JwtModule, // Exporte o JwtModule para que o token possa ser assinado por outros módulos se necessário
    JwtStrategy // Exporte a estratégia se precisar ser usada em outros lugares para validação.
  ],
})
export class AuthModule {}