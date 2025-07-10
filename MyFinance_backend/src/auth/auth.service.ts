// myfinance-app/backend/src/auth/auth.service.ts
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
// import { UserRole } from './enums/user-role.enum'; // Não é estritamente necessário importar aqui, pois o default já está na entity

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
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
      // `role` não precisa ser explicitamente definido aqui, pois tem um `default: UserRole.USER` na entidade
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505' || error.message?.includes('SQLITE_CONSTRAINT')) {
        throw new ConflictException('Este email já está em uso.');
      } else {
        console.error('Erro ao salvar usuário:', error);
        throw new InternalServerErrorException('Erro ao registrar o usuário.');
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;

    const user = await this.usersRepository.findOneBy({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas. Verifique seu email e senha.');
    }

    // --- ATUALIZAÇÃO NO PAYLOAD DO JWT: INCLUIR O PAPEL DO USUÁRIO ---
    const payload = { email: user.email, sub: user.id, role: user.role }; // Adicionamos 'role'
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}