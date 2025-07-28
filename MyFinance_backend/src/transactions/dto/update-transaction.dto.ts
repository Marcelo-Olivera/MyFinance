// myfinance-app/backend/src/transactions/dto/update-transaction.dto.ts
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Matches,
  IsInt,
} from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum'; // Para filtros de tipo

export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber({}, { message: 'O valor da transação deve ser um número.' })
  @Min(0.01, { message: 'O valor da transação deve ser positivo.' })
  amount?: number;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string.' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'A data deve ser uma string.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'A data deve estar no formato AAAA-MM-DD.' })
  date?: string;

  @IsOptional()
  @IsEnum(TransactionType, { message: 'O tipo da transação deve ser "income" ou "expense".' })
  type?: TransactionType;

  @IsOptional()
  @IsString({ message: 'As notas devem ser uma string.' })
  notes: string | null; // Permite null para alinhamento com a entidade

  @IsOptional()
  @IsInt({ message: 'O ID da categoria deve ser um número inteiro.' })
  categoryId?: number | null; // Pode ser null para remover a categoria
}