// myfinance-app/backend/src/categories/categories.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, // Importe UseGuards
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Req, // Importe Req para acessar o objeto de requisição
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Importe o guard JWT
import { User } from '../auth/entities/user.entity'; // Importe a entidade User para tipagem
import { Request } from 'express'; // Para tipar o objeto Request

// Dica: Crie um decorator @GetUser() para simplificar o acesso ao usuário
// Ex: src/auth/decorators/get-user.decorator.ts
// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// export const GetUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext): User => {
//     const request = ctx.switchToHttp().getRequest();
//     return request.user;
//   },
// );

@Controller('categories') // Prefixo para todas as rotas neste controlador será /categories
@UseGuards(JwtAuthGuard) // Aplica JwtAuthGuard a TODAS as rotas neste controller
@UsePipes(ValidationPipe) // Aplica validação automática para todos os DTOs
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post() // POST /categories
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request): Promise<any> {
    // Obtenha o usuário autenticado do objeto de requisição (anexado pelo JwtStrategy)
    const user = req.user as User; // Faça um type assertion para User

    return this.categoriesService.createCategory(createCategoryDto, user);
  }

  @Get() // GET /categories
  async findAll(@Req() req: Request): Promise<any[]> {
    const user = req.user as User;
    return this.categoriesService.findAllCategories(user.id);
  }

  @Get(':id') // GET /categories/:id
  async findOne(@Param('id') id: string, @Req() req: Request): Promise<any> {
    const user = req.user as User;
    return this.categoriesService.findOneCategory(+id, user.id); // Use +id para converter para number
  }

  @Patch(':id') // PATCH /categories/:id
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Req() req: Request): Promise<any> {
    const user = req.user as User;
    return this.categoriesService.updateCategory(+id, updateCategoryDto, user.id);
  }

  @Delete(':id') // DELETE /categories/:id
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content para deleção bem-sucedida
  async remove(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const user = req.user as User;
    await this.categoriesService.removeCategory(+id, user.id);
  }
}