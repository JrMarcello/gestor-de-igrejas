import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { CreateMemberDto, UpdateMemberDto } from './dto/member.dto';
import { NotFoundException } from '@nestjs/common';

describe('MembersController', () => {
  let controller: MembersController;
  let service: MembersService;

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

  const mockMembersService = {
    create: jest.fn().mockResolvedValue(mockMember),
    findAll: jest.fn().mockResolvedValue([mockMember]),
    findOne: jest.fn().mockResolvedValue(mockMember),
    update: jest.fn().mockResolvedValue(mockMember),
    remove: jest.fn().mockResolvedValue(mockMember),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        {
          provide: MembersService,
          useValue: mockMembersService,
        },
      ],
    }).compile();

    controller = module.get<MembersController>(MembersController);
    service = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a member', async () => {
      const createDto: CreateMemberDto = {
        name: 'New Member',
        birthDate: '2001-01-01',
        phone: '987654321',
        address: 'New Address',
        baptized: false,
      };
      expect(await controller.create(createDto)).toEqual(mockMember);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      expect(await controller.findAll()).toEqual([mockMember]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single member', async () => {
      expect(await controller.findOne(mockMember.id)).toEqual(mockMember);
      expect(service.findOne).toHaveBeenCalledWith(mockMember.id);
    });

    it('should throw NotFoundException', async () => {
      mockMembersService.findOne.mockRejectedValueOnce(new NotFoundException());
      await expect(controller.findOne('nonExistentId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a member', async () => {
      const updateDto: UpdateMemberDto = { name: 'Updated Name' };
      expect(await controller.update(mockMember.id, updateDto)).toEqual(mockMember);
      expect(service.update).toHaveBeenCalledWith(mockMember.id, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a member', async () => {
      expect(await controller.remove(mockMember.id)).toEqual(mockMember);
      expect(service.remove).toHaveBeenCalledWith(mockMember.id);
    });
  });
});
