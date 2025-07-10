// myfinance-app/backend/src/categories/categories.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from '../auth/entities/user.entity'; // Importe a entidade User

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto, user: User): Promise<Category> {
    const { name, color } = createCategoryDto;

    // Verificar se o usuário já tem uma categoria com o mesmo nome (case-insensitive)
    const existingCategory = await this.categoriesRepository.findOne({
      where: {
        name: name.toLowerCase(), // Compare o nome em minúsculas
        userId: user.id,
      },
    });

    if (existingCategory) {
      throw new ConflictException(`Você já possui uma categoria com o nome "${name}".`);
    }

    const category = this.categoriesRepository.create({
      name: name.toLowerCase(), // Salve o nome em minúsculas para consistência na busca
      color,
      user,  // Linka a categoria ao objeto User
      userId: user.id, // Linka a categoria ao ID do User
    });

    try {
      await this.categoriesRepository.save(category);
      // Retorne a categoria sem o objeto user completo para evitar dados circulares ou desnecessários
      // ou use a lógica de Serialização (class-transformer) para omitir campos.
      return { ...category, user: undefined };
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      // Podemos adicionar tratamento de erro mais específico se necessário
      throw new ConflictException('Erro ao criar categoria.');
    }
  }

  async findAllCategories(userId: number): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { userId },
      order: { name: 'ASC' }, // Ordena por nome
      select: ['id', 'name', 'color'], // Não retorna o objeto User
    });
  }

  async findOneCategory(id: number, userId: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id, userId },
      select: ['id', 'name', 'color'],
    });

    if (!category) {
      throw new NotFoundException(`Categoria com ID "${id}" não encontrada ou não pertence a este usuário.`);
    }
    return category;
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto, userId: number): Promise<Category> {
    const category = await this.findOneCategory(id, userId); // Reutiliza findOne para verificar existência e posse

    // Verifica se o novo nome já existe para o mesmo usuário (excluindo a própria categoria)
    if (updateCategoryDto.name && updateCategoryDto.name.toLowerCase() !== category.name) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: {
          name: updateCategoryDto.name.toLowerCase(),
          userId: userId,
        },
      });
      if (existingCategory) {
        throw new ConflictException(`Você já possui outra categoria com o nome "${updateCategoryDto.name}".`);
      }
    }

    // Atualiza apenas os campos fornecidos
    const updatedCategory = Object.assign(category, {
      ...updateCategoryDto,
      name: updateCategoryDto.name ? updateCategoryDto.name.toLowerCase() : category.name // Salva nome atualizado em minúsculas
    });

    try {
      return await this.categoriesRepository.save(updatedCategory);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw new ConflictException('Erro ao atualizar categoria.');
    }
  }

  async removeCategory(id: number, userId: number): Promise<void> {
    // Verifica se a categoria existe e pertence ao usuário antes de tentar remover
    const result = await this.categoriesRepository.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException(`Categoria com ID "${id}" não encontrada ou não pertence a este usuário.`);
    }
  }
}