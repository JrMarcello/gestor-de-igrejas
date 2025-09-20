import { Test, TestingModule } from '@nestjs/testing';
import { BiblicalSchoolService } from './biblical-school.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ClassRole, AttendanceStatus } from '@prisma/client';

describe('BiblicalSchoolService', () => {
  let service: BiblicalSchoolService;
  let prisma: PrismaService;

  const mockClass = {
    id: 'classId1',
    name: 'Turma Teste',
    description: 'Descrição da turma',
    createdAt: new Date(),
    updatedAt: new Date(),
    participants: [],
    attendees: [],
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

  const mockClassAssignment = {
    id: 'caId1',
    memberId: mockMember.id,
    classId: mockClass.id,
    role: ClassRole.STUDENT,
    assignedAt: new Date(),
  };

  const mockAttendance = {
    id: 'attId1',
    studentId: mockMember.id,
    classId: mockClass.id,
    date: new Date('2025-01-01'),
    status: AttendanceStatus.PRESENT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    biblicalSchoolClass: {
      create: jest.fn().mockResolvedValue(mockClass),
      findMany: jest.fn().mockResolvedValue([mockClass]),
      findUnique: jest.fn().mockResolvedValue(mockClass),
      update: jest.fn().mockResolvedValue(mockClass),
      delete: jest.fn().mockResolvedValue(mockClass),
    },
    member: {
      findUnique: jest.fn().mockResolvedValue(mockMember),
    },
    classAssignment: {
      create: jest.fn().mockResolvedValue(mockClassAssignment),
      findUnique: jest.fn().mockResolvedValue(mockClassAssignment),
      delete: jest.fn().mockResolvedValue(mockClassAssignment),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    attendance: {
      create: jest.fn().mockResolvedValue(mockAttendance),
      findUnique: jest.fn().mockResolvedValue(mockAttendance),
      update: jest.fn().mockResolvedValue(mockAttendance),
      findMany: jest.fn().mockResolvedValue([mockAttendance]),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BiblicalSchoolService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BiblicalSchoolService>(BiblicalSchoolService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a class', async () => {
      const createDto = { name: 'New Class', description: 'New Desc' };
      const result = await service.create(createDto);
      expect(prisma.biblicalSchoolClass.create).toHaveBeenCalledWith({ data: createDto });
      expect(result).toEqual(mockClass);
    });
  });

  describe('findAll', () => {
    it('should return an array of classes', async () => {
      const result = await service.findAll();
      expect(prisma.biblicalSchoolClass.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockClass]);
    });
  });

  describe('findOne', () => {
    it('should return a single class', async () => {
      const result = await service.findOne(mockClass.id);
      expect(prisma.biblicalSchoolClass.findUnique).toHaveBeenCalledWith({
        where: { id: mockClass.id },
        include: { participants: { include: { member: true } }, attendees: true },
      });
      expect(result).toEqual(mockClass);
    });

    it('should throw NotFoundException if class not found', async () => {
      mockPrismaService.biblicalSchoolClass.findUnique.mockResolvedValueOnce(null);
      await expect(service.findOne('nonExistentId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a class', async () => {
      const updateDto = { name: 'Updated Class' };
      const updatedClass = { ...mockClass, ...updateDto };
      mockPrismaService.biblicalSchoolClass.update.mockResolvedValueOnce(updatedClass);

      const result = await service.update(mockClass.id, updateDto);
      expect(prisma.biblicalSchoolClass.update).toHaveBeenCalledWith({
        where: { id: mockClass.id },
        data: updateDto,
      });
      expect(result).toEqual(updatedClass);
    });
  });

  describe('remove', () => {
    it('should remove a class and its associations', async () => {
      const result = await service.remove(mockClass.id);
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.classAssignment.deleteMany).toHaveBeenCalledWith({ where: { classId: mockClass.id } });
      expect(prisma.attendance.deleteMany).toHaveBeenCalledWith({ where: { classId: mockClass.id } });
      expect(result).toEqual(mockClass);
    });
  });

  describe('assignParticipant', () => {
    it('should assign a participant to a class', async () => {
      mockPrismaService.classAssignment.findUnique.mockResolvedValueOnce(null);
      const assignDto = { memberId: mockMember.id, role: ClassRole.STUDENT };
      const result = await service.assignParticipant(mockClass.id, assignDto);
      expect(prisma.biblicalSchoolClass.findUnique).toHaveBeenCalledWith({ where: { id: mockClass.id } });
      expect(prisma.member.findUnique).toHaveBeenCalledWith({ where: { id: mockMember.id } });
      expect(prisma.classAssignment.create).toHaveBeenCalledWith({
        data: { classId: mockClass.id, memberId: mockMember.id, role: ClassRole.STUDENT },
      });
      expect(result).toEqual(mockClassAssignment);
    });

    it('should throw NotFoundException if class not found', async () => {
      mockPrismaService.biblicalSchoolClass.findUnique.mockResolvedValueOnce(null);
      await expect(service.assignParticipant('nonExistentClass', { memberId: mockMember.id, role: ClassRole.STUDENT })).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if member not found', async () => {
      mockPrismaService.member.findUnique.mockResolvedValueOnce(null);
      await expect(service.assignParticipant(mockClass.id, { memberId: 'nonExistentMember', role: ClassRole.STUDENT })).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if participant already assigned', async () => {
      mockPrismaService.classAssignment.findUnique.mockResolvedValueOnce(mockClassAssignment);
      await expect(service.assignParticipant(mockClass.id, { memberId: mockMember.id, role: ClassRole.STUDENT })).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeParticipant', () => {
    it('should remove a participant from a class', async () => {
      const result = await service.removeParticipant(mockClass.id, mockMember.id);
      expect(prisma.classAssignment.findUnique).toHaveBeenCalledWith({
        where: { memberId_classId: { memberId: mockMember.id, classId: mockClass.id } },
      });
      expect(prisma.classAssignment.delete).toHaveBeenCalledWith({
        where: { memberId_classId: { memberId: mockMember.id, classId: mockClass.id } },
      });
      expect(result).toEqual(mockClassAssignment);
    });

    it('should throw NotFoundException if participant not in class', async () => {
      mockPrismaService.classAssignment.findUnique.mockResolvedValueOnce(null);
      await expect(service.removeParticipant(mockClass.id, mockMember.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('recordAttendance', () => {
    it('should create an attendance record', async () => {
      mockPrismaService.attendance.findUnique.mockResolvedValueOnce(null);
      const recordDto = { memberId: mockMember.id, date: '2025-01-01', status: AttendanceStatus.PRESENT };
      const result = await service.recordAttendance(mockClass.id, recordDto);
      expect(prisma.attendance.create).toHaveBeenCalled();
      expect(result).toEqual(mockAttendance);
    });

    it('should update an attendance record if it exists', async () => {
      mockPrismaService.attendance.findUnique.mockResolvedValueOnce(mockAttendance);
      const recordDto = { memberId: mockMember.id, date: '2025-01-01', status: AttendanceStatus.ABSENT };
      const updatedAttendance = { ...mockAttendance, status: AttendanceStatus.ABSENT };
      mockPrismaService.attendance.update.mockResolvedValueOnce(updatedAttendance);

      const result = await service.recordAttendance(mockClass.id, recordDto);
      expect(prisma.attendance.update).toHaveBeenCalled();
      expect(result).toEqual(updatedAttendance);
    });
  });

  describe('getAttendance', () => {
    it('should return attendance records for a class and date', async () => {
      const result = await service.getAttendance(mockClass.id, '2025-01-01');
      expect(prisma.biblicalSchoolClass.findUnique).toHaveBeenCalledWith({ where: { id: mockClass.id } });
      expect(prisma.attendance.findMany).toHaveBeenCalledWith({
        where: { classId: mockClass.id, date: new Date('2025-01-01') },
        include: { student: true },
      });
      expect(result).toEqual([mockAttendance]);
    });

    it('should throw NotFoundException if class not found', async () => {
      mockPrismaService.biblicalSchoolClass.findUnique.mockResolvedValueOnce(null);
      await expect(service.getAttendance('nonExistentClass', '2025-01-01')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAttendance', () => {
    it('should update an attendance record', async () => {
      mockPrismaService.attendance.findUnique.mockResolvedValueOnce(mockAttendance);
      const updateDto = { status: AttendanceStatus.ABSENT };
      const updatedAttendance = { ...mockAttendance, status: AttendanceStatus.ABSENT };
      mockPrismaService.attendance.update.mockResolvedValueOnce(updatedAttendance);

      const result = await service.updateAttendance(mockAttendance.id, updateDto);
      expect(prisma.attendance.update).toHaveBeenCalledWith({
        where: { id: mockAttendance.id },
        data: updateDto,
      });
      expect(result).toEqual(updatedAttendance);
    });

    it('should throw NotFoundException if attendance record not found', async () => {
      mockPrismaService.attendance.findUnique.mockResolvedValueOnce(null);
      await expect(service.updateAttendance('nonExistentId', { status: AttendanceStatus.ABSENT })).rejects.toThrow(NotFoundException);
    });
  });
});
