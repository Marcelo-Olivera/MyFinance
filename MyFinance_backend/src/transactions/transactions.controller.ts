// src/transactions/transactions.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseIntPipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { TransactionType } from './enums/transaction-type.enum';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Endpoint para obter o resumo financeiro (receita total, despesa total, saldo).
   * Rota: GET /transactions/summary
   */
  @Get('summary')
  async getSummary(@Req() req: Request) {
    const user = req.user as any;
    return this.transactionsService.getFinancialSummary(user.id);
  }

  /**
   * Endpoint para obter o resumo de transações por categoria (receitas e despesas), com filtros de data.
   * Rota: GET /transactions/summary-by-category
   * ✅ ALTERADO: Agora aceita query parameters para startDate e endDate
   */
  @Get('summary-by-category')
  async getSummaryByCategory(
    @Req() req: Request,
    @Query('startDate') startDate?: string, // ✅ NOVO: Parâmetro de query para data inicial
    @Query('endDate') endDate?: string,     // ✅ NOVO: Parâmetro de query para data final
  ) {
    const user = req.user as any;
    return this.transactionsService.getTransactionsSummaryByCategory(user.id, startDate, endDate);
  }

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto, @Req() req: Request) {
    const user = req.user as any;
    return this.transactionsService.createTransaction(createTransactionDto, user);
  }

  @Get()
  async findAll(@Req() req: Request, @Query('type') type?: TransactionType, @Query('categoryId') categoryId?: number, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    const user = req.user as any;
    const filters = { type, categoryId, startDate, endDate };
    return this.transactionsService.findAllTransactions(user.id, filters);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as any;
    return this.transactionsService.findOneTransaction(id, user.id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTransactionDto: UpdateTransactionDto, @Req() req: Request) {
    const user = req.user as any;
    return this.transactionsService.updateTransaction(id, updateTransactionDto, user);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as any;
    return this.transactionsService.removeTransaction(id, user.id);
  }
}
//import { TransactionType } from './enums/transaction-type.enum'; // Para filtros de tipo