// myfinance-app/backend/src/transactions/transactions.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch, // Já importado, mas vamos usar depois
  Param, // Já importado, mas vamos usar depois
  Delete, // Já importado, mas vamos usar depois
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Req,
  Query // Para filtros em GET
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto'; // Vamos usar depois
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/entities/user.entity';
import { Request } from 'express'; // Para tipar o objeto Request
import { Transaction } from './entities/transaction.entity'; // Para tipagem de retorno
import { TransactionType } from './enums/transaction-type.enum'; // Para filtros de tipo

@Controller('transactions') // Prefixo para todas as rotas neste controlador
@UseGuards(JwtAuthGuard) // Aplica JwtAuthGuard a TODAS as rotas neste controller
@UsePipes(ValidationPipe) // Aplica validação automática para todos os DTOs
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post() // POST /transactions
  @HttpCode(HttpStatus.CREATED) // Retorna 201 Created em caso de sucesso
  async create(@Body() createTransactionDto: CreateTransactionDto, @Req() req: Request): Promise<Transaction> {
    const user = req.user as User; // Acessa o usuário logado via req.user
    return this.transactionsService.createTransaction(createTransactionDto, user);
  }

  @Get() // GET /transactions (com filtros opcionais)
  async findAll(
    @Req() req: Request,
    @Query('type') type?: TransactionType, // Filtro por tipo (income/expense)
    @Query('categoryId') categoryId?: number, // Filtro por ID da categoria
    @Query('startDate') startDate?: string, // Filtro por data inicial (AAAA-MM-DD)
    @Query('endDate') endDate?: string,     // Filtro por data final (AAAA-MM-DD)
  ): Promise<Transaction[]> {
    const user = req.user as User;
    // Cria um objeto de filtros e remove as propriedades undefined/null
    const rawFilters = { type, categoryId, startDate, endDate };
    // Esta abordagem filtra as entradas e recria o objeto, evitando o erro de tipagem.
    const cleanFilters = Object.fromEntries(
      Object.entries(rawFilters).filter(([, value]) => value !== undefined && value !== null)
    );

    return this.transactionsService.findAllTransactions(user.id, cleanFilters);
  }

  // --- MÉTODOS PATCH e DELETE VIRÃO DEPOIS ---
  @Get(':id') // GET /transactions/:id
  async findOne(@Param('id') id: string, @Req() req: Request): Promise<Transaction> {
    const user = req.user as User;
    return this.transactionsService.findOneTransaction(+id, user.id);
  }

  @Patch(':id') // PATCH /transactions/:id
  async update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Req() req: Request): Promise<Transaction> {
    const user = req.user as User;
    return this.transactionsService.updateTransaction(+id, updateTransactionDto, user);
  }

  @Delete(':id') // DELETE /transactions/:id
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content para deleção bem-sucedida
  async remove(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const user = req.user as User;
    await this.transactionsService.removeTransaction(+id, user.id);
  }
}