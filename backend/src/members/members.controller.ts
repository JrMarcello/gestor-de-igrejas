import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto, UpdateMemberDto } from './dto/member.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @ApiOperation({ summary: 'Criar novo membro' })
  @ApiBody({ type: CreateMemberDto })
  @ApiResponse({ status: 201, description: 'Membro criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @ApiOperation({ summary: 'Listar todos os membros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de membros retornada com sucesso',
    type: [CreateMemberDto],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @ApiOperation({ summary: 'Buscar membro por ID' })
  @ApiParam({ name: 'id', description: 'ID do membro' })
  @ApiResponse({
    status: 200,
    description: 'Membro encontrado',
    type: CreateMemberDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Membro não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar membro' })
  @ApiParam({ name: 'id', description: 'ID do membro' })
  @ApiBody({ type: UpdateMemberDto })
  @ApiResponse({
    status: 200,
    description: 'Membro atualizado com sucesso',
    type: CreateMemberDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Membro não encontrado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(id, updateMemberDto);
  }

  @ApiOperation({ summary: 'Remover membro' })
  @ApiParam({ name: 'id', description: 'ID do membro' })
  @ApiResponse({ status: 204, description: 'Membro removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Membro não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
