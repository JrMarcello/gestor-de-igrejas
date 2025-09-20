import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Em um caso real, aqui nós buscaríamos o usuário completo no banco de dados
    // usando o ID do payload para garantir que ele ainda existe, etc.
    // Por enquanto, vamos apenas retornar o payload decodificado.
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
