// myfinance-app/backend/src/transactions/transactions.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from '../auth/entities/user.entity'; // Importe User
import { CategoriesService } from '../categories/categories.service'; // Importe CategoriesService

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private categoriesService: CategoriesService, // Injeta CategoriesService
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto, user: User): Promise<Transaction> {
    const { amount, description, date, type, notes, categoryId } = createTransactionDto;

    // 1. Validar a Categoria (se fornecida)
    let category = undefined; // category será undefined se categoryId não for fornecido ou for null
    if (categoryId) {
      // Busca a categoria e valida se ela pertence ao usuário logado
      category = await this.categoriesService.findOneCategory(categoryId, user.id);
      if (!category) {
        throw new BadRequestException(`Categoria com ID "${categoryId}" não encontrada ou não pertence a este usuário.`);
      }
    }

    // 2. Criar a Transação
    const transaction = new Transaction(); // Usar new Transaction() para atribuir relações
    transaction.amount = amount;
    transaction.description = description;
    transaction.date = date;
    transaction.type = type;
    transaction.notes = notes;
    transaction.user = user; // Associa ao usuário logado
    transaction.userId = user.id; // Associa ao ID do usuário logado
    transaction.category = category; // Associa à categoria (pode ser undefined)
    transaction.categoryId = categoryId || null; // Associa ao ID da categoria (pode ser null)

    try {
      const savedTransaction = await this.transactionsRepository.save(transaction);
      // Retorna a transação salva, removendo os objetos user e category para evitar recursão
      return { ...savedTransaction, user: undefined, category: undefined };
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      throw new BadRequestException('Erro ao criar transação.');
    }
  }

  async findAllTransactions(userId: number, filters?: { type?: TransactionType, categoryId?: number, startDate?: string, endDate?: string }): Promise<Transaction[]> {
    const queryBuilder = this.transactionsRepository.createQueryBuilder('transaction');

    queryBuilder
      .where('transaction.userId = :userId', { userId }) // Filtra por usuário logado
      .leftJoinAndSelect('transaction.category', 'category'); // Carrega a relação com categoria

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

    queryBuilder.orderBy('transaction.date', 'DESC'); // Ordena por data mais recente

    return queryBuilder.getMany();
  }

  async findOneTransaction(id: number, userId: number): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, userId },
      relations: ['category'], // Carrega a relação com categoria
    });

    if (!transaction) {
      throw new NotFoundException(`Transação com ID "${id}" não encontrada ou não pertence a este usuário.`);
    }
    return transaction;
  }

  async updateTransaction(id: number, updateTransactionDto: UpdateTransactionDto, user: User): Promise<Transaction> {
    const transaction = await this.findOneTransaction(id, user.id); // Verifica existência e posse

    const { categoryId } = updateTransactionDto;

    // Validar a Categoria (se fornecida para atualização)
    if (categoryId !== undefined) { // categoryId pode ser 0 ou null, por isso undefined
      if (categoryId === null) { // Se o frontend explicitamente quer remover a categoria
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

    // Atualiza os outros campos
    Object.assign(transaction, updateTransactionDto);

    try {
      const savedTransaction = await this.transactionsRepository.save(transaction);
      return { ...savedTransaction, user: undefined, category: undefined };
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw new BadRequestException('Erro ao atualizar transação.');
    }
  }

  async removeTransaction(id: number, userId: number): Promise<void> {
    const result = await this.transactionsRepository.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException(`Transação com ID "${id}" não encontrada ou não pertence a este usuário.`);
    }
  }
}