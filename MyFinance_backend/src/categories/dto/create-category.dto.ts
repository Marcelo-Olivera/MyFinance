// myfinance-app/backend/src/categories/dto/create-category.dto.ts
import { IsNotEmpty, IsString, MaxLength, IsOptional, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'O nome da categoria deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome da categoria não pode ser vazio.' })
  @MaxLength(50, { message: 'O nome da categoria deve ter no máximo 50 caracteres.' })
  name: string;

  @IsOptional() // A cor é opcional
  @IsString({ message: 'A cor deve ser uma string.' })
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: 'Formato de cor inválido (deve ser hexadecimal, ex: #RRGGBB ou #RGB).' })
  color?: string; // Usamos '?' para indicar que é opcional
}