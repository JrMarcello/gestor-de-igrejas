import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AssignParticipantDto,
  CreateBiblicalSchoolClassDto,
  RecordAttendanceDto,
  UpdateAttendanceDto,
  UpdateBiblicalSchoolClassDto,
} from './dto/biblical-school.dto';

@Injectable()
export class BiblicalSchoolService {
  constructor(private prisma: PrismaService) {}

  create(createBiblicalSchoolClassDto: CreateBiblicalSchoolClassDto) {
    return this.prisma.biblicalSchoolClass.create({
      data: createBiblicalSchoolClassDto,
    });
  }

  findAll() {
    return this.prisma.biblicalSchoolClass.findMany({
      include: { participants: { include: { member: true } }, attendances: true },
    });
  }

  async findOne(id: string) {
    const classItem = await this.prisma.biblicalSchoolClass.findUnique({
      where: { id },
      include: { participants: { include: { member: true } }, attendances: true },
    });
    if (!classItem) {
      throw new NotFoundException(
        `Biblical School Class with ID ${id} not found`,
      );
    }
    return classItem;
  }

  update(
    id: string,
    updateBiblicalSchoolClassDto: UpdateBiblicalSchoolClassDto,
  ) {
    return this.prisma.biblicalSchoolClass.update({
      where: { id },
      data: updateBiblicalSchoolClassDto,
    });
  }

  remove(id: string) {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.classAssignment.deleteMany({ where: { classId: id } });
      await prisma.attendance.deleteMany({ where: { classId: id } });
      return prisma.biblicalSchoolClass.delete({ where: { id } });
    });
  }

  async assignParticipant(
    classId: string,
    assignParticipantDto: AssignParticipantDto,
  ) {
    const { memberId, role } = assignParticipantDto;

    const classItem = await this.prisma.biblicalSchoolClass.findUnique({
      where: { id: classId },
    });
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!classItem) {
      throw new NotFoundException(
        `Biblical School Class with ID ${classId} not found`,
      );
    }
    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

    const existingAssignment = await this.prisma.classAssignment.findUnique({
      where: { memberId_classId: { memberId, classId } },
    });

    if (existingAssignment) {
      throw new BadRequestException(
        `Member ${memberId} is already assigned to class ${classId}`,
      );
    }

    return this.prisma.classAssignment.create({
      data: {
        classId,
        memberId,
        role,
      },
    });
  }

  async removeParticipant(classId: string, memberId: string) {
    const existingAssignment = await this.prisma.classAssignment.findUnique({
      where: { memberId_classId: { memberId, classId } },
    });

    if (!existingAssignment) {
      throw new NotFoundException(
        `Member ${memberId} is not assigned to class ${classId}`,
      );
    }

    return this.prisma.classAssignment.delete({
      where: { memberId_classId: { memberId, classId } },
    });
  }

  async recordAttendance(
    classId: string,
    recordAttendanceDto: RecordAttendanceDto,
  ) {
    const { memberId, date, status } = recordAttendanceDto;

    const classItem = await this.prisma.biblicalSchoolClass.findUnique({
      where: { id: classId },
    });
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!classItem) {
      throw new NotFoundException(
        `Biblical School Class with ID ${classId} not found`,
      );
    }
    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

    // Verifica se já existe um registro de presença para a data e membro
    const existingAttendance = await this.prisma.attendance.findUnique({
      where: {
        date_studentId_classId: {
          date: new Date(date),
          studentId: memberId,
          classId,
        },
      },
    });

    if (existingAttendance) {
      return this.prisma.attendance.update({
        where: {
          date_studentId_classId: {
            date: new Date(date),
            studentId: memberId,
            classId,
          },
        },
        data: { status },
      });
    } else {
      return this.prisma.attendance.create({
        data: {
          classId,
          studentId: memberId,
          date: new Date(date),
          status,
        },
      });
    }
  }

  async getAttendance(classId: string, date: string) {
    const classItem = await this.prisma.biblicalSchoolClass.findUnique({
      where: { id: classId },
    });
    if (!classItem) {
      throw new NotFoundException(
        `Biblical School Class with ID ${classId} not found`,
      );
    }

    return this.prisma.attendance.findMany({
      where: {
        classId,
        date: new Date(date),
      },
      include: { student: true },
    });
  }

  async updateAttendance(
    attendanceId: string,
    updateAttendanceDto: UpdateAttendanceDto,
  ) {
    const { status } = updateAttendanceDto;
    const attendance = await this.prisma.attendance.findUnique({
      where: { id: attendanceId },
    });

    if (!attendance) {
      throw new NotFoundException(
        `Attendance record with ID ${attendanceId} not found`,
      );
    }

    return this.prisma.attendance.update({
      where: { id: attendanceId },
      data: { status },
    });
  }
}
