// myfinance-app/backend/src/categories/categories.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity'; // Importe a entidade Category
import { AuthModule } from '../auth/auth.module'; // Importe o AuthModule para usar guards e estratégias

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]), // Permite que CategoriesModule interaja com a entidade Category
    AuthModule, // Importe AuthModule para usar JwtAuthGuard e JwtStrategy
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService], // Exporte o serviço se ele for usado em outros módulos (ex: TransactionsModule)
})
export class CategoriesModule {}