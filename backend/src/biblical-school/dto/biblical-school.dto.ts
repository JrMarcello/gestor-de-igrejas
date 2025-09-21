import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ClassRole, AttendanceStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBiblicalSchoolClassDto {
  @ApiProperty({
    example: 'Fundamentos da Fé',
    description: 'Nome da turma',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Turma para novos convertidos',
    description: 'Descrição da turma',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateBiblicalSchoolClassDto {
  @ApiPropertyOptional({
    example: 'Fundamentos da Fé',
    description: 'Nome da turma',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Turma para novos convertidos',
    description: 'Descrição da turma',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class AssignParticipantDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID do membro a ser adicionado à turma',
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({
    example: 'TEACHER',
    description: 'Papel do participante na turma',
    enum: ClassRole,
  })
  @IsEnum(ClassRole)
  @IsNotEmpty()
  role: ClassRole;
}

export class RecordAttendanceDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID do membro',
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({
    example: '2024-03-21',
    description: 'Data da aula (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    example: 'PRESENT',
    description: 'Status de presença',
    enum: AttendanceStatus,
  })
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;
}

export class UpdateAttendanceDto {
  @ApiProperty({
    example: 'PRESENT',
    description: 'Status de presença',
    enum: AttendanceStatus,
  })
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;
}
