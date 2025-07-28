// src/transactions/transactions.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from '../auth/entities/user.entity';
import { CategoriesService } from '../categories/categories.service';
import { TransactionType } from './enums/transaction-type.enum'; // Importe o enum TransactionType

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private categoriesService: CategoriesService,
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto, user: User): Promise<Transaction> {
    const { amount, description, date, type, notes, categoryId } = createTransactionDto;

    let category = undefined;
    if (categoryId) {
      category = await this.categoriesService.findOneCategory(categoryId, user.id);
      if (!category) {
        throw new BadRequestException(`Categoria com ID "${categoryId}" não encontrada ou não pertence a este usuário.`);
      }
    }

    const transaction = new Transaction();
    transaction.amount = amount;
    transaction.description = description;
    transaction.date = date;
    transaction.type = type;
    transaction.notes = notes;
    transaction.user = user;
    transaction.userId = user.id;
    transaction.category = category;
    transaction.categoryId = categoryId || null;

    try {
      const savedTransaction = await this.transactionsRepository.save(transaction);
      return { ...savedTransaction, user: undefined, category: undefined };
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      throw new BadRequestException('Erro ao criar transação.');
    }
  }

  async findAllTransactions(userId: number, filters?: { type?: TransactionType, categoryId?: number, startDate?: string, endDate?: string }): Promise<Transaction[]> {
    const queryBuilder = this.transactionsRepository.createQueryBuilder('transaction');

    queryBuilder
      .where('transaction.userId = :userId', { userId })
      .leftJoinAndSelect('transaction.category', 'category');

    if (filters?.type) {
      queryBuilder.andWhere('transaction.type = :type', { type: filters.type });
    }
    if (filters?.categoryId) {
      queryBuilder.andWhere('transaction.categoryId = :categoryId', { categoryId: filters.categoryId });
    }
    if (filters?.startDate) {
      queryBuilder.andWhere('transaction.date >= :startDate', { startDate: filters.startDate });
    }
    if (filters?.endDate) {
      queryBuilder.andWhere('transaction.date <= :endDate', { endDate: filters.endDate });
    }

    queryBuilder.orderBy('transaction.date', 'DESC');

    const transactions = await queryBuilder.getMany();
    return transactions.map(t => ({
      ...t,
      amount: parseFloat(t.amount.toString()),
    }));
  }

  async findOneTransaction(id: number, userId: number): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transação com ID "${id}" não encontrada para este usuário.`);
    }
    return { ...transaction, amount: parseFloat(transaction.amount.toString()) };
  }

  async updateTransaction(id: number, updateTransactionDto: UpdateTransactionDto, user: User): Promise<Transaction> {
    const transaction = await this.findOneTransaction(id, user.id);

    const { categoryId } = updateTransactionDto;

    if (categoryId !== undefined) {
      if (categoryId === null) {
        transaction.category = null;
        transaction.categoryId = null;
      } else {
        const category = await this.categoriesService.findOneCategory(categoryId, user.id);
        if (!category) {
          throw new BadRequestException(`Categoria com ID "${categoryId}" não encontrada ou não pertence a este usuário.`);
        }
        transaction.category = category;
        transaction.categoryId = categoryId;
      }
    }

    Object.assign(transaction, updateTransactionDto);

    try {
      const savedTransaction = await this.transactionsRepository.save(transaction);
      return { ...savedTransaction, user: undefined, category: undefined, amount: parseFloat(savedTransaction.amount.toString()) };
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw new BadRequestException('Erro ao atualizar transação.');
    }
  }

  async removeTransaction(id: number, userId: number): Promise<void> {
    const result = await this.transactionsRepository.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException(`Transação com ID "${id}" não encontrada para este usuário.`);
    }
  }

  /**
   * Calcula o resumo financeiro (receita total, despesa total e saldo) para um usuário.
   * @param userId O ID do usuário.
   * @returns Um objeto com totalIncome, totalExpense e balance.
   */
  async getFinancialSummary(userId: number): Promise<{ totalIncome: number; totalExpense: number; balance: number }> {
    const transactions = await this.transactionsRepository.find({
      where: { userId },
      select: ['amount', 'type'],
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
      const amountAsNumber = parseFloat(transaction.amount.toString());
      if (transaction.type === TransactionType.INCOME) {
        totalIncome += amountAsNumber;
      } else if (transaction.type === TransactionType.EXPENSE) {
        totalExpense += amountAsNumber;
      }
    });

    const balance = totalIncome - totalExpense;

    return {
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpense: parseFloat(totalExpense.toFixed(2)),
      balance: parseFloat(balance.toFixed(2)),
    };
  }

  /**
   * Obtém o resumo de transações por categoria (receitas e despesas), com filtros de data.
   * Transações sem categoria serão agrupadas como 'Outros'.
   * @param userId O ID do usuário.
   * @param startDate Data inicial para o filtro (AAAA-MM-DD).
   * @param endDate Data final para o filtro (AAAA-MM-DD).
   * @returns Um objeto contendo arrays de receitas por categoria e despesas por categoria.
   */
  async getTransactionsSummaryByCategory(
    userId: number,
    startDate?: string, // ✅ NOVO: Parâmetro startDate
    endDate?: string,   // ✅ NOVO: Parâmetro endDate
  ): Promise<{
    incomeByCategory: { categoryName: string; amount: number; categoryColor?: string }[];
    expenseByCategory: { categoryName: string; amount: number; categoryColor?: string }[];
  }> {
    const queryBuilder = this.transactionsRepository.createQueryBuilder('transaction');

    queryBuilder
      .where('transaction.userId = :userId', { userId })
      .leftJoinAndSelect('transaction.category', 'category'); // Carrega o relacionamento com a categoria

    // ✅ NOVO: Adiciona filtros de data ao queryBuilder
    if (startDate) {
      queryBuilder.andWhere('transaction.date >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('transaction.date <= :endDate', { endDate });
    }

    const transactions = await queryBuilder.getMany(); // Executa a query com os filtros

    const incomeMap = new Map<string, { amount: number; categoryColor?: string }>();
    const expenseMap = new Map<string, { amount: number; categoryColor?: string }>();

    transactions.forEach(transaction => {
      const amountAsNumber = parseFloat(transaction.amount.toString());
      const categoryName = transaction.category?.name || 'Outros';
      const categoryColor = transaction.category?.color || '#808080';

      if (transaction.type === TransactionType.INCOME) {
        const current = incomeMap.get(categoryName) || { amount: 0, categoryColor: categoryColor };
        current.amount += amountAsNumber;
        incomeMap.set(categoryName, current);
      } else if (transaction.type === TransactionType.EXPENSE) {
        const current = expenseMap.get(categoryName) || { amount: 0, categoryColor: categoryColor };
        current.amount += amountAsNumber;
        expenseMap.set(categoryName, current);
      }
    });

    const incomeByCategory = Array.from(incomeMap.entries()).map(([name, data]) => ({
      categoryName: name,
      amount: parseFloat(data.amount.toFixed(2)),
      categoryColor: data.categoryColor,
    }));

    const expenseByCategory = Array.from(expenseMap.entries()).map(([name, data]) => ({
      categoryName: name,
      amount: parseFloat(data.amount.toFixed(2)),
      categoryColor: data.categoryColor,
    }));

    return { incomeByCategory, expenseByCategory };
  }
}
//import { TransactionType } from './enums/transaction-type.enum'; // Importe o enum TransactionType