import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signup(dto: SignUpDto) {
    const { email, password } = dto;

    // Hash da senha
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      // Cria o usuário no banco de dados
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      // Retorna o usuário sem a senha
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error.code === 'P2002') { // Código de erro do Prisma para violação de constraint única
        throw new ForbiddenException('Credentials taken');
      }
      throw error;
    }
  }

  async signin(dto: SignInDto) {
    const { email, password } = dto;

    // Encontra o usuário pelo email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // Compara as senhas
    const pwMatches = await bcrypt.compare(password, user.password);

    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // Gera e retorna o token JWT
    return this.signToken(user.id, user.email, user.role);
  }

  async signToken(userId: string, email: string, role: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}

