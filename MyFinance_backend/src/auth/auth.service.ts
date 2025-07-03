// myfinance-app/backend/src/auth/auth.service.ts
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt'; // Importe o JwtService

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService, // Injeta o JwtService
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;

    const foundUser = await this.usersRepository.findOneBy({ email });
    if (foundUser) {
      throw new ConflictException('Este email já está em uso.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      // Lidar com possíveis erros de banco de dados (além de email duplicado)
      // Para SQLite, o erro pode ser 'SQLITE_CONSTRAINT: UNIQUE constraint failed: user.email'
      if (error.code === '23505' || error.message?.includes('SQLITE_CONSTRAINT')) {
        throw new ConflictException('Este email já está em uso.');
      } else {
        console.error('Erro ao salvar usuário:', error); // Para depuração
        throw new InternalServerErrorException('Erro ao registrar o usuário.');
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;

    // 1. Buscar o usuário pelo email
    const user = await this.usersRepository.findOneBy({ email });

    // 2. Verificar se o usuário existe e se a senha está correta
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas. Verifique seu email e senha.');
    }

    // 3. Se as credenciais forem válidas, gerar o JWT
    const payload = { email: user.email, sub: user.id }; // 'sub' é uma convenção para o ID do usuário
    const accessToken = await this.jwtService.sign(payload); // Assina o payload para criar o token

    return { accessToken };
  }
}