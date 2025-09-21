import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ClassRole, AttendanceStatus } from '@prisma/client';

export class CreateBiblicalSchoolClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateBiblicalSchoolClassDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class AssignParticipantDto {
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @IsEnum(ClassRole)
  @IsNotEmpty()
  role: ClassRole;
}

export class RecordAttendanceDto {
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;
}

export class UpdateAttendanceDto {
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;
}
