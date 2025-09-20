import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { BiblicalSchoolService } from './biblical-school.service';
import { CreateBiblicalSchoolClassDto, UpdateBiblicalSchoolClassDto, AssignParticipantDto, RecordAttendanceDto, UpdateAttendanceDto } from './dto/biblical-school.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('biblical-school')
export class BiblicalSchoolController {
  constructor(private readonly biblicalSchoolService: BiblicalSchoolService) {}

  @Post()
  create(@Body() createBiblicalSchoolClassDto: CreateBiblicalSchoolClassDto) {
    return this.biblicalSchoolService.create(createBiblicalSchoolClassDto);
  }

  @Get()
  findAll() {
    return this.biblicalSchoolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.biblicalSchoolService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBiblicalSchoolClassDto: UpdateBiblicalSchoolClassDto) {
    return this.biblicalSchoolService.update(id, updateBiblicalSchoolClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.biblicalSchoolService.remove(id);
  }

  // Endpoints para participantes
  @Post(':id/participants')
  @HttpCode(HttpStatus.NO_CONTENT)
  assignParticipant(@Param('id') classId: string, @Body() assignParticipantDto: AssignParticipantDto) {
    return this.biblicalSchoolService.assignParticipant(classId, assignParticipantDto);
  }

  @Delete(':id/participants/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeParticipant(@Param('id') classId: string, @Param('memberId') memberId: string) {
    return this.biblicalSchoolService.removeParticipant(classId, memberId);
  }

  // Endpoints para presença
  @Post(':id/attendance')
  recordAttendance(@Param('id') classId: string, @Body() recordAttendanceDto: RecordAttendanceDto) {
    return this.biblicalSchoolService.recordAttendance(classId, recordAttendanceDto);
  }

  @Get(':id/attendance')
  getAttendance(@Param('id') classId: string, @Query('date') date: string) {
    return this.biblicalSchoolService.getAttendance(classId, date);
  }

  @Patch('attendance/:attendanceId')
  updateAttendance(@Param('attendanceId') attendanceId: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.biblicalSchoolService.updateAttendance(attendanceId, updateAttendanceDto);
  }
}

