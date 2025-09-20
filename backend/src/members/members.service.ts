import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto, UpdateMemberDto } from './dto/member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  create(createMemberDto: CreateMemberDto) {
    return this.prisma.member.create({ data: createMemberDto });
  }

  findAll() {
    return this.prisma.member.findMany();
  }

  findOne(id: string) {
    return this.prisma.member.findUnique({ where: { id } });
  }

  update(id: string, updateMemberDto: UpdateMemberDto) {
    return this.prisma.member.update({
      where: { id },
      data: updateMemberDto,
    });
  }

  remove(id: string) {
    return this.prisma.member.delete({ where: { id } });
  }
}

