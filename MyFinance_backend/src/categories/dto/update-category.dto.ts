// myfinance-app/backend/src/categories/dto/update-category.dto.ts
import { IsOptional, IsString, MaxLength, Matches, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString({ message: 'O nome da categoria deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome da categoria não pode ser vazio.' }) // Embora IsOptional, se presente, não pode ser vazio
  @MaxLength(50, { message: 'O nome da categoria deve ter no máximo 50 caracteres.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'A cor deve ser uma string.' })
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: 'Formato de cor inválido (deve ser hexadecimal, ex: #RRGGBB ou #RGB).' })
  color?: string;
}