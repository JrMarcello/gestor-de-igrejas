import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto, UpdateMemberDto } from './dto/member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  create(createMemberDto: CreateMemberDto) {
    // Converte a data de nascimento para DateTime
    const birthDate = new Date(createMemberDto.birthDate);
    birthDate.setUTCHours(12, 0, 0, 0); // Define meio-dia UTC para evitar problemas de fuso horário

    return this.prisma.member.create({
      data: {
        ...createMemberDto,
        birthDate,
      },
    });
  }

  findAll() {
    return this.prisma.member.findMany();
  }

  async findOne(id: string) {
    const member = await this.prisma.member.findUnique({ where: { id } });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  update(id: string, updateMemberDto: UpdateMemberDto) {
    const data = { ...updateMemberDto };

    // Se houver uma data de nascimento, converte para DateTime
    if (data.birthDate) {
      const birthDate = new Date(data.birthDate);
      birthDate.setUTCHours(12, 0, 0, 0);
      data.birthDate = birthDate;
    }

    return this.prisma.member.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.member.delete({ where: { id } });
  }
}
