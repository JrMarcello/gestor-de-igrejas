import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  create(createGroupDto: CreateGroupDto) {
    return this.prisma.group.create({ data: createGroupDto });
  }

  findAll() {
    return this.prisma.group.findMany({
      include: { members: { include: { member: true } } }, // Inclui os membros associados
    });
  }

  async findOne(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: { members: { include: { member: true } } },
    });
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  update(id: string, updateGroupDto: UpdateGroupDto) {
    return this.prisma.group.update({
      where: { id },
      data: updateGroupDto,
    });
  }

  remove(id: string) {
    // Antes de remover o grupo, remove as associações de membros
    return this.prisma.$transaction(async (prisma) => {
      await prisma.membersOnGroups.deleteMany({ where: { groupId: id } });
      return prisma.group.delete({ where: { id } });
    });
  }

  async addMember(groupId: string, memberId: string) {
    // Verifica se o membro e o grupo existem
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }
    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

    // Verifica se o membro já está no grupo
    const existing = await this.prisma.membersOnGroups.findUnique({
      where: { memberId_groupId: { memberId, groupId } },
    });

    if (existing) {
      throw new BadRequestException(
        `Member ${memberId} is already in group ${groupId}`,
      );
    }

    return this.prisma.membersOnGroups.create({
      data: {
        groupId,
        memberId,
      },
    });
  }

  async removeMember(groupId: string, memberId: string) {
    const existing = await this.prisma.membersOnGroups.findUnique({
      where: { memberId_groupId: { memberId, groupId } },
    });

    if (!existing) {
      throw new NotFoundException(
        `Member ${memberId} not found in group ${groupId}`,
      );
    }

    return this.prisma.membersOnGroups.delete({
      where: { memberId_groupId: { memberId, groupId } },
    });
  }
}
