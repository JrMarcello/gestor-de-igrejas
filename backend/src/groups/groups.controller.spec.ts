import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { CreateGroupDto, UpdateGroupDto, AssignMemberDto } from './dto/group.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('GroupsController', () => {
  let controller: GroupsController;
  let service: GroupsService;

  const mockGroup = {
    id: 'groupId1',
    name: 'Test Group',
    description: 'A test group',
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [],
  };

  const mockMembersOnGroups = {
    id: 'mogId1',
    memberId: 'memberId1',
    groupId: 'groupId1',
    assignedAt: new Date(),
  };

  const mockGroupsService = {
    create: jest.fn().mockResolvedValue(mockGroup),
    findAll: jest.fn().mockResolvedValue([mockGroup]),
    findOne: jest.fn().mockResolvedValue(mockGroup),
    update: jest.fn().mockResolvedValue(mockGroup),
    remove: jest.fn().mockResolvedValue(mockGroup),
    addMember: jest.fn().mockResolvedValue(mockMembersOnGroups),
    removeMember: jest.fn().mockResolvedValue(mockMembersOnGroups),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        {
          provide: GroupsService,
          useValue: mockGroupsService,
        },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a group', async () => {
      const createDto: CreateGroupDto = { name: 'New Group' };
      expect(await controller.create(createDto)).toEqual(mockGroup);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      expect(await controller.findAll()).toEqual([mockGroup]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single group', async () => {
      expect(await controller.findOne(mockGroup.id)).toEqual(mockGroup);
      expect(service.findOne).toHaveBeenCalledWith(mockGroup.id);
    });

    it('should throw NotFoundException', async () => {
      mockGroupsService.findOne.mockRejectedValueOnce(new NotFoundException());
      await expect(controller.findOne('nonExistentId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a group', async () => {
      const updateDto: UpdateGroupDto = { name: 'Updated Group' };
      expect(await controller.update(mockGroup.id, updateDto)).toEqual(mockGroup);
      expect(service.update).toHaveBeenCalledWith(mockGroup.id, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a group', async () => {
      expect(await controller.remove(mockGroup.id)).toEqual(mockGroup);
      expect(service.remove).toHaveBeenCalledWith(mockGroup.id);
    });
  });

  describe('addMember', () => {
    it('should add a member to a group', async () => {
      const assignDto: AssignMemberDto = { memberId: 'memberId1' };
      await controller.addMember(mockGroup.id, assignDto);
      expect(service.addMember).toHaveBeenCalledWith(mockGroup.id, assignDto.memberId);
    });

    it('should throw BadRequestException', async () => {
      mockGroupsService.addMember.mockRejectedValueOnce(new BadRequestException());
      await expect(controller.addMember(mockGroup.id, { memberId: 'memberId1' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeMember', () => {
    it('should remove a member from a group', async () => {
      await controller.removeMember(mockGroup.id, 'memberId1');
      expect(service.removeMember).toHaveBeenCalledWith(mockGroup.id, 'memberId1');
    });

    it('should throw NotFoundException', async () => {
      mockGroupsService.removeMember.mockRejectedValueOnce(new NotFoundException());
      await expect(controller.removeMember(mockGroup.id, 'memberId1')).rejects.toThrow(NotFoundException);
    });
  });
});
