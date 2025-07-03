// myfinance-app/backend/src/auth/dto/auth-credentials.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsEmail({}, { message: 'Por favor, insira um email válido.' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;
}