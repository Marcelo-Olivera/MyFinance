// myfinance-app/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { Transaction } from './transactions/entities/transaction.entity';
import { TransactionsModule } from './transactions/transactions.module'; // <-- NOVO: Importe o TransactionsModule

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // MUDOU: Agora é 'postgres'
      url: process.env.DATABASE_URL, // NOVO: Usa a variável de ambiente
      entities: [User, Category, Transaction],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false // NOVO: Necessário para a conexão com o Render
      }
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    TransactionsModule, // <-- NOVO: Adicione o TransactionsModule aqui
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}