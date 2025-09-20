import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('GroupsService', () => {
  let service: GroupsService;
  let prisma: PrismaService;

  const mockGroup = {
    id: 'groupId1',
    name: 'Test Group',
    description: 'A test group',
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [],
  };

  const mockMember = {
    id: 'memberId1',
    name: 'Test Member',
    birthDate: new Date(),
    phone: null,
    address: null,
    baptized: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMembersOnGroups = {
    id: 'mogId1',
    memberId: mockMember.id,
    groupId: mockGroup.id,
    assignedAt: new Date(),
  };

  const mockPrismaService = {
    group: {
      create: jest.fn().mockResolvedValue(mockGroup),
      findMany: jest.fn().mockResolvedValue([mockGroup]),
      findUnique: jest.fn().mockResolvedValue(mockGroup),
      update: jest.fn().mockResolvedValue(mockGroup),
      delete: jest.fn().mockResolvedValue(mockGroup),
    },
    member: {
      findUnique: jest.fn().mockResolvedValue(mockMember),
    },
    membersOnGroups: {
      create: jest.fn().mockResolvedValue(mockMembersOnGroups),
      findUnique: jest.fn().mockResolvedValue(mockMembersOnGroups),
      delete: jest.fn().mockResolvedValue(mockMembersOnGroups),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a group', async () => {
      const createDto = { name: 'New Group', description: 'New Description' };
      const result = await service.create(createDto);
      expect(prisma.group.create).toHaveBeenCalledWith({ data: createDto });
      expect(result).toEqual(mockGroup);
    });
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      const result = await service.findAll();
      expect(prisma.group.findMany).toHaveBeenCalledWith({ include: { members: { include: { member: true } } } });
      expect(result).toEqual([mockGroup]);
    });
  });

  describe('findOne', () => {
    it('should return a single group', async () => {
      const result = await service.findOne(mockGroup.id);
      expect(prisma.group.findUnique).toHaveBeenCalledWith({
        where: { id: mockGroup.id },
        include: { members: { include: { member: true } } },
      });
      expect(result).toEqual(mockGroup);
    });

    it('should throw NotFoundException if group not found', async () => {
      mockPrismaService.group.findUnique.mockResolvedValueOnce(null);
      await expect(service.findOne('nonExistentId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a group', async () => {
      const updateDto = { name: 'Updated Group' };
      const updatedGroup = { ...mockGroup, ...updateDto };
      mockPrismaService.group.update.mockResolvedValueOnce(updatedGroup);

      const result = await service.update(mockGroup.id, updateDto);
      expect(prisma.group.update).toHaveBeenCalledWith({
        where: { id: mockGroup.id },
        data: updateDto,
      });
      expect(result).toEqual(updatedGroup);
    });
  });

  describe('remove', () => {
    it('should remove a group and its member associations', async () => {
      const result = await service.remove(mockGroup.id);
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.membersOnGroups.deleteMany).toHaveBeenCalledWith({ where: { groupId: mockGroup.id } });
      expect(prisma.group.delete).toHaveBeenCalledWith({ where: { id: mockGroup.id } });
      expect(result).toEqual(mockGroup);
    });
  });

  describe('addMember', () => {
    it('should add a member to a group', async () => {
      mockPrismaService.membersOnGroups.findUnique.mockResolvedValueOnce(null);
      const result = await service.addMember(mockGroup.id, mockMember.id);
      expect(prisma.group.findUnique).toHaveBeenCalledWith({ where: { id: mockGroup.id } });
      expect(prisma.member.findUnique).toHaveBeenCalledWith({ where: { id: mockMember.id } });
      expect(prisma.membersOnGroups.create).toHaveBeenCalledWith({
        data: { groupId: mockGroup.id, memberId: mockMember.id },
      });
      expect(result).toEqual(mockMembersOnGroups);
    });

    it('should throw NotFoundException if group not found', async () => {
      mockPrismaService.group.findUnique.mockResolvedValueOnce(null);
      await expect(service.addMember('nonExistentGroup', mockMember.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if member not found', async () => {
      mockPrismaService.member.findUnique.mockResolvedValueOnce(null);
      await expect(service.addMember(mockGroup.id, 'nonExistentMember')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if member already in group', async () => {
      mockPrismaService.membersOnGroups.findUnique.mockResolvedValueOnce(mockMembersOnGroups);
      await expect(service.addMember(mockGroup.id, mockMember.id)).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeMember', () => {
    it('should remove a member from a group', async () => {
      const result = await service.removeMember(mockGroup.id, mockMember.id);
      expect(prisma.membersOnGroups.findUnique).toHaveBeenCalledWith({
        where: { memberId_groupId: { memberId: mockMember.id, groupId: mockGroup.id } },
      });
      expect(prisma.membersOnGroups.delete).toHaveBeenCalledWith({
        where: { memberId_groupId: { memberId: mockMember.id, groupId: mockGroup.id } },
      });
      expect(result).toEqual(mockMembersOnGroups);
    });

    it('should throw NotFoundException if member not in group', async () => {
      mockPrismaService.membersOnGroups.findUnique.mockResolvedValueOnce(null);
      await expect(service.removeMember(mockGroup.id, mockMember.id)).rejects.toThrow(NotFoundException);
    });
  });
});
