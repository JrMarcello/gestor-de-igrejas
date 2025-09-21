import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummaryData() {
    const totalMembers = await this.prisma.member.count();
    const totalGroups = await this.prisma.group.count();
    const totalBiblicalSchoolClasses =
      await this.prisma.biblicalSchoolClass.count();

    // Poderíamos adicionar mais dados aqui, como membros batizados, etc.

    return {
      totalMembers,
      totalGroups,
      totalBiblicalSchoolClasses,
    };
  }
}
