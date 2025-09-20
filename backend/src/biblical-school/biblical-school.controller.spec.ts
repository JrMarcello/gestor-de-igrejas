import { Test, TestingModule } from '@nestjs/testing';
import { BiblicalSchoolController } from './biblical-school.controller';
import { BiblicalSchoolService } from './biblical-school.service';
import { CreateBiblicalSchoolClassDto, UpdateBiblicalSchoolClassDto, AssignParticipantDto, RecordAttendanceDto, UpdateAttendanceDto } from './dto/biblical-school.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ClassRole, AttendanceStatus } from '@prisma/client';

describe('BiblicalSchoolController', () => {
  let controller: BiblicalSchoolController;
  let service: BiblicalSchoolService;

  const mockClass = {
    id: 'classId1',
    name: 'Turma Teste',
    description: 'Descrição da turma',
    createdAt: new Date(),
    updatedAt: new Date(),
    participants: [],
    attendees: [],
  };

  const mockAttendance = {
    id: 'attId1',
    studentId: 'memberId1',
    classId: 'classId1',
    date: new Date('2025-01-01'),
    status: AttendanceStatus.PRESENT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBiblicalSchoolService = {
    create: jest.fn().mockResolvedValue(mockClass),
    findAll: jest.fn().mockResolvedValue([mockClass]),
    findOne: jest.fn().mockResolvedValue(mockClass),
    update: jest.fn().mockResolvedValue(mockClass),
    remove: jest.fn().mockResolvedValue(mockClass),
    assignParticipant: jest.fn().mockResolvedValue({}),
    removeParticipant: jest.fn().mockResolvedValue({}),
    recordAttendance: jest.fn().mockResolvedValue(mockAttendance),
    getAttendance: jest.fn().mockResolvedValue([mockAttendance]),
    updateAttendance: jest.fn().mockResolvedValue(mockAttendance),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BiblicalSchoolController],
      providers: [
        {
          provide: BiblicalSchoolService,
          useValue: mockBiblicalSchoolService,
        },
      ],
    }).compile();

    controller = module.get<BiblicalSchoolController>(BiblicalSchoolController);
    service = module.get<BiblicalSchoolService>(BiblicalSchoolService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a class', async () => {
      const createDto: CreateBiblicalSchoolClassDto = { name: 'New Class' };
      expect(await controller.create(createDto)).toEqual(mockClass);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of classes', async () => {
      expect(await controller.findAll()).toEqual([mockClass]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single class', async () => {
      expect(await controller.findOne(mockClass.id)).toEqual(mockClass);
      expect(service.findOne).toHaveBeenCalledWith(mockClass.id);
    });

    it('should throw NotFoundException', async () => {
      mockBiblicalSchoolService.findOne.mockRejectedValueOnce(new NotFoundException());
      await expect(controller.findOne('nonExistentId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a class', async () => {
      const updateDto: UpdateBiblicalSchoolClassDto = { name: 'Updated Class' };
      expect(await controller.update(mockClass.id, updateDto)).toEqual(mockClass);
      expect(service.update).toHaveBeenCalledWith(mockClass.id, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a class', async () => {
      expect(await controller.remove(mockClass.id)).toEqual(mockClass);
      expect(service.remove).toHaveBeenCalledWith(mockClass.id);
    });
  });

  describe('assignParticipant', () => {
    it('should assign a participant', async () => {
      const assignDto: AssignParticipantDto = { memberId: 'memberId1', role: ClassRole.STUDENT };
      await controller.assignParticipant(mockClass.id, assignDto);
      expect(service.assignParticipant).toHaveBeenCalledWith(mockClass.id, assignDto);
    });

    it('should throw BadRequestException', async () => {
      mockBiblicalSchoolService.assignParticipant.mockRejectedValueOnce(new BadRequestException());
      await expect(controller.assignParticipant(mockClass.id, { memberId: 'memberId1', role: ClassRole.STUDENT })).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeParticipant', () => {
    it('should remove a participant', async () => {
      await controller.removeParticipant(mockClass.id, 'memberId1');
      expect(service.removeParticipant).toHaveBeenCalledWith(mockClass.id, 'memberId1');
    });

    it('should throw NotFoundException', async () => {
      mockBiblicalSchoolService.removeParticipant.mockRejectedValueOnce(new NotFoundException());
      await expect(controller.removeParticipant(mockClass.id, 'memberId1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('recordAttendance', () => {
    it('should record attendance', async () => {
      const recordDto: RecordAttendanceDto = { memberId: 'memberId1', date: '2025-01-01', status: AttendanceStatus.PRESENT };
      expect(await controller.recordAttendance(mockClass.id, recordDto)).toEqual(mockAttendance);
      expect(service.recordAttendance).toHaveBeenCalledWith(mockClass.id, recordDto);
    });
  });

  describe('getAttendance', () => {
    it('should return attendance records', async () => {
      expect(await controller.getAttendance(mockClass.id, '2025-01-01')).toEqual([mockAttendance]);
      expect(service.getAttendance).toHaveBeenCalledWith(mockClass.id, '2025-01-01');
    });
  });

  describe('updateAttendance', () => {
    it('should update attendance', async () => {
      const updateDto: UpdateAttendanceDto = { status: AttendanceStatus.ABSENT };
      expect(await controller.updateAttendance(mockAttendance.id, updateDto)).toEqual(mockAttendance);
      expect(service.updateAttendance).toHaveBeenCalledWith(mockAttendance.id, updateDto);
    });
  });
});
