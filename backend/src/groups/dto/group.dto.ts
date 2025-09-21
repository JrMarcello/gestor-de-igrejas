import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({
    example: 'Jovens',
    description: 'Nome do grupo ou ministério',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Grupo de jovens da igreja',
    description: 'Descrição do grupo ou ministério',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateGroupDto {
  @ApiPropertyOptional({
    example: 'Jovens',
    description: 'Nome do grupo ou ministério',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Grupo de jovens da igreja',
    description: 'Descrição do grupo ou ministério',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class AssignMemberDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID do membro a ser adicionado ao grupo',
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;
}
