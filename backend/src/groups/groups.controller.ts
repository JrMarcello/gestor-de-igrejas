import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import {
  CreateGroupDto,
  UpdateGroupDto,
  AssignMemberDto,
} from './dto/group.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOperation({ summary: 'Criar novo grupo' })
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({
    status: 201,
    description: 'Grupo criado com sucesso',
    type: CreateGroupDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @ApiOperation({ summary: 'Listar todos os grupos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de grupos retornada com sucesso',
    type: [CreateGroupDto],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @ApiOperation({ summary: 'Buscar grupo por ID' })
  @ApiParam({ name: 'id', description: 'ID do grupo' })
  @ApiResponse({
    status: 200,
    description: 'Grupo encontrado',
    type: CreateGroupDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar grupo' })
  @ApiParam({ name: 'id', description: 'ID do grupo' })
  @ApiBody({ type: UpdateGroupDto })
  @ApiResponse({
    status: 200,
    description: 'Grupo atualizado com sucesso',
    type: CreateGroupDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @ApiOperation({ summary: 'Remover grupo' })
  @ApiParam({ name: 'id', description: 'ID do grupo' })
  @ApiResponse({ status: 204, description: 'Grupo removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }

  @ApiOperation({ summary: 'Adicionar membro ao grupo' })
  @ApiParam({ name: 'id', description: 'ID do grupo' })
  @ApiBody({ type: AssignMemberDto })
  @ApiResponse({ status: 204, description: 'Membro adicionado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Grupo ou membro não encontrado' })
  @Post(':id/members')
  @HttpCode(HttpStatus.NO_CONTENT)
  addMember(
    @Param('id') groupId: string,
    @Body() assignMemberDto: AssignMemberDto,
  ) {
    return this.groupsService.addMember(groupId, assignMemberDto.memberId);
  }

  @ApiOperation({ summary: 'Remover membro do grupo' })
  @ApiParam({ name: 'id', description: 'ID do grupo' })
  @ApiParam({ name: 'memberId', description: 'ID do membro' })
  @ApiResponse({ status: 204, description: 'Membro removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Grupo ou membro não encontrado' })
  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMember(
    @Param('id') groupId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.groupsService.removeMember(groupId, memberId);
  }
}
