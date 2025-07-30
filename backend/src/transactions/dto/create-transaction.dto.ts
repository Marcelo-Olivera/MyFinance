// myfinance-app/backend/src/transactions/dto/create-transaction.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Matches,
  IsInt,
} from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum'; // Para filtros de tipo

export class CreateTransactionDto {
  @IsNumber({}, { message: 'O valor da transação deve ser um número.' })
  @Min(0.01, { message: 'O valor da transação deve ser positivo.' })
  @IsNotEmpty({ message: 'O valor da transação é obrigatório.' })
  amount: number;

  @IsString({ message: 'A descrição deve ser uma string.' })
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  description: string;

  @IsString({ message: 'A data deve ser uma string.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'A data deve estar no formato AAAA-MM-DD.' })
  @IsNotEmpty({ message: 'A data é obrigatória.' })
  date: string;

  @IsEnum(TransactionType, { message: 'O tipo da transação deve ser "income" ou "expense".' })
  type: TransactionType;

  @IsOptional()
  @IsString({ message: 'As notas devem ser uma string.' })
  notes: string | null; 

  @IsOptional()
  @IsInt({ message: 'O ID da categoria deve ser um número inteiro.' })
  categoryId?: number | null;
}