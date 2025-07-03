import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'; // Importe o AuthModule
import { User } from './auth/entities/user.entity'; // Importe a entidade User

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User], // Adicione a entidade User aqui
      synchronize: true,
    }),
    AuthModule, // Adicione o AuthModule aqui
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}