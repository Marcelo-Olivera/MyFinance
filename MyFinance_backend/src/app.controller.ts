// myfinance-app/backend/src/app.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common'; // Importe UseGuards e Req
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'; // Importe o JwtAuthGuard
import { Request } from 'express'; // Importe Request do express para tipagem

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // --- NOVO ENDPOINT PROTEGIDO ---
  @UseGuards(JwtAuthGuard) // Aplica o Guard JWT a este endpoint
  @Get('/profile') // Este endpoint será /profile
  getProfile(@Req() req: Request): any { // Injeta o objeto Request para acessar req.user
    // O `req.user` é preenchido pelo JwtStrategy com o objeto User (ou JwtPayload, se você preferir)
    // Isso significa que você sabe qual usuário está autenticado
    console.log('Usuário autenticado acessando /profile:', req.user);
    return {
      message: 'Você acessou uma rota protegida!',
      user: req.user, // Retorna os dados do usuário logado
    };
  }
  // --- FIM DO NOVO ENDPOINT ---
}