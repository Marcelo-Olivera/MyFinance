// myfinance-app/backend/src/auth/strategy/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum'; // Importe o enum UserRole

// Atualize a interface JwtPayload para incluir 'role'
export interface JwtPayload {
  email: string;
  sub: number;
  role: UserRole; // Adicione a propriedade role
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      secretOrKey: 'superSecretKey123', // Mantenha o mesmo secret
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email, sub, role } = payload; // Extraia o role do payload
    const user = await this.usersRepository.findOneBy({ id: sub, email }); // Melhor buscar por ID e email

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado ou token inválido.');
    }

    // Importante: anexe o role ao objeto user que será salvo em req.user
    // Se a entidade User já tem o campo role, não precisa fazer isso explicitamente aqui
    // Mas se você quisesse um objeto mais leve em req.user: return { id: user.id, email: user.email, role: user.role };

    return user; // Retorna o objeto User completo com o role
  }
}