// myfinance-app/backend/src/transactions/transactions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity'; // Importe a entidade Transaction
import { AuthModule } from '../auth/auth.module'; // Importe o AuthModule
import { CategoriesModule } from '../categories/categories.module'; // Importe o CategoriesModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]), // Permite que TransactionsModule interaja com a entidade Transaction
    AuthModule, // Para JwtAuthGuard e acesso ao User
    CategoriesModule, // Para acessar CategoriesService se necessário (para validar categoria)
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService], // Exporte o serviço se ele for usado em outros módulos
})
export class TransactionsModule {}