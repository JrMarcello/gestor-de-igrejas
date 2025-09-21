import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do membro',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Data de nascimento (formato YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string | Date;

  @ApiPropertyOptional({
    example: '83988887777',
    description: 'Número de telefone',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: 'Rua das Flores, 123',
    description: 'Endereço completo',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica se o membro é batizado',
  })
  @IsBoolean()
  @IsOptional()
  baptized?: boolean;
}

export class UpdateMemberDto {
  @ApiPropertyOptional({
    example: 'João Silva',
    description: 'Nome completo do membro',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Data de nascimento (formato YYYY-MM-DD)',
  })
  @IsDateString()
  @IsOptional()
  birthDate?: string | Date;

  @ApiPropertyOptional({
    example: '83988887777',
    description: 'Número de telefone',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: 'Rua das Flores, 123',
    description: 'Endereço completo',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica se o membro é batizado',
  })
  @IsBoolean()
  @IsOptional()
  baptized?: boolean;
}
