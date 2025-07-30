// myfinance-app/backend/src/auth/auth.controller.ts
import { Body, Controller, Post, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ message: string }> {
    await this.authService.signUp(authCredentialsDto);
    return { message: 'Usuário registrado com sucesso!' };
  }

  @Post('/signin') // Este endpoint será /auth/signin
  @HttpCode(HttpStatus.OK) // Retorna status 200 OK em caso de sucesso
  @UsePipes(ValidationPipe)
  async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}