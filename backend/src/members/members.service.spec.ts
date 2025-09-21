import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('MembersService', () => {
  let service: MembersService;
  let prisma: PrismaService;

  const mockMember = {
    id: 'memberId1',
    name: 'Test Member',
    birthDate: new Date('2000-01-01'),
    phone: '123456789',
    address: 'Test Address',
    baptized: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    member: {
      create: jest.fn().mockResolvedValue(mockMember),
      findMany: jest.fn().mockResolvedValue([mockMember]),
      findUnique: jest.fn().mockResolvedValue(mockMember),
      update: jest.fn().mockResolvedValue(mockMember),
      delete: jest.fn().mockResolvedValue(mockMember),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a member', async () => {
      const createDto = {
        name: 'New Member',
        birthDate: '2001-01-01',
        phone: '987654321',
        address: 'New Address',
        baptized: false,
      };
      const newMember = { ...mockMember, ...createDto, id: 'newId' };
      mockPrismaService.member.create.mockResolvedValueOnce(newMember);

      const result = await service.create(createDto);
      expect(prisma.member.create).toHaveBeenCalledWith({ data: createDto });
      expect(result).toEqual(newMember);
    });
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      const result = await service.findAll();
      expect(prisma.member.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockMember]);
    });
  });

  describe('findOne', () => {
    it('should return a single member', async () => {
      const result = await service.findOne(mockMember.id);
      expect(prisma.member.findUnique).toHaveBeenCalledWith({
        where: { id: mockMember.id },
      });
      expect(result).toEqual(mockMember);
    });

    it('should throw NotFoundException if member not found', async () => {
      mockPrismaService.member.findUnique.mockResolvedValueOnce(null);
      await expect(service.findOne('nonExistentId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a member', async () => {
      const updateDto = { name: 'Updated Name' };
      const updatedMember = { ...mockMember, ...updateDto };
      mockPrismaService.member.update.mockResolvedValueOnce(updatedMember);

      const result = await service.update(mockMember.id, updateDto);
      expect(prisma.member.update).toHaveBeenCalledWith({
        where: { id: mockMember.id },
        data: updateDto,
      });
      expect(result).toEqual(updatedMember);
    });
  });

  describe('remove', () => {
    it('should remove a member', async () => {
      const result = await service.remove(mockMember.id);
      expect(prisma.member.delete).toHaveBeenCalledWith({
        where: { id: mockMember.id },
      });
      expect(result).toEqual(mockMember);
    });
  });
});
