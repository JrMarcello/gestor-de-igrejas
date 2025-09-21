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
  Query,
} from '@nestjs/common';
import { BiblicalSchoolService } from './biblical-school.service';
import {
  CreateBiblicalSchoolClassDto,
  UpdateBiblicalSchoolClassDto,
  AssignParticipantDto,
  RecordAttendanceDto,
  UpdateAttendanceDto,
} from './dto/biblical-school.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('biblical-school')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('biblical-school')
export class BiblicalSchoolController {
  constructor(private readonly biblicalSchoolService: BiblicalSchoolService) {}

  @ApiOperation({ summary: 'Criar nova turma' })
  @ApiBody({ type: CreateBiblicalSchoolClassDto })
  @ApiResponse({ status: 201, description: 'Turma criada com sucesso', type: CreateBiblicalSchoolClassDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @Post()
  create(@Body() createBiblicalSchoolClassDto: CreateBiblicalSchoolClassDto) {
    return this.biblicalSchoolService.create(createBiblicalSchoolClassDto);
  }

  @ApiOperation({ summary: 'Listar todas as turmas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de turmas retornada com sucesso',
    type: [CreateBiblicalSchoolClassDto],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @Get()
  findAll() {
    return this.biblicalSchoolService.findAll();
  }

  @ApiOperation({ summary: 'Buscar turma por ID' })
  @ApiParam({ name: 'id', description: 'ID da turma' })
  @ApiResponse({ 
    status: 200, 
    description: 'Turma encontrada',
    type: CreateBiblicalSchoolClassDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.biblicalSchoolService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar turma' })
  @ApiParam({ name: 'id', description: 'ID da turma' })
  @ApiBody({ type: UpdateBiblicalSchoolClassDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Turma atualizada com sucesso',
    type: CreateBiblicalSchoolClassDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBiblicalSchoolClassDto: UpdateBiblicalSchoolClassDto,
  ) {
    return this.biblicalSchoolService.update(id, updateBiblicalSchoolClassDto);
  }

  @ApiOperation({ summary: 'Remover turma' })
  @ApiParam({ name: 'id', description: 'ID da turma' })
  @ApiResponse({ status: 204, description: 'Turma removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.biblicalSchoolService.remove(id);
  }

  @ApiOperation({ summary: 'Adicionar participante à turma' })
  @ApiParam({ name: 'id', description: 'ID da turma' })
  @ApiBody({ type: AssignParticipantDto })
  @ApiResponse({ status: 204, description: 'Participante adicionado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma ou membro não encontrado' })
  @Post(':id/participants')
  @HttpCode(HttpStatus.NO_CONTENT)
  assignParticipant(
    @Param('id') classId: string,
    @Body() assignParticipantDto: AssignParticipantDto,
  ) {
    return this.biblicalSchoolService.assignParticipant(
      classId,
      assignParticipantDto,
    );
  }

  @ApiOperation({ summary: 'Remover participante da turma' })
  @ApiParam({ name: 'id', description: 'ID da turma' })
  @ApiParam({ name: 'memberId', description: 'ID do participante' })
  @ApiResponse({ status: 204, description: 'Participante removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma ou participante não encontrado' })
  @Delete(':id/participants/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeParticipant(
    @Param('id') classId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.biblicalSchoolService.removeParticipant(classId, memberId);
  }

  @ApiOperation({ summary: 'Registrar presença' })
  @ApiParam({ name: 'id', description: 'ID da turma' })
  @ApiBody({ type: RecordAttendanceDto })
  @ApiResponse({ status: 201, description: 'Presença registrada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma ou participante não encontrado' })
  @Post(':id/attendance')
  recordAttendance(
    @Param('id') classId: string,
    @Body() recordAttendanceDto: RecordAttendanceDto,
  ) {
    return this.biblicalSchoolService.recordAttendance(
      classId,
      recordAttendanceDto,
    );
  }

  @ApiOperation({ summary: 'Buscar presenças da turma' })
  @ApiParam({ name: 'id', description: 'ID da turma' })
  @ApiQuery({ 
    name: 'date', 
    required: false, 
    description: 'Data para filtrar presenças (YYYY-MM-DD)' 
  })
  @ApiResponse({ status: 200, description: 'Lista de presenças retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @Get(':id/attendance')
  getAttendance(@Param('id') classId: string, @Query('date') date: string) {
    return this.biblicalSchoolService.getAttendance(classId, date);
  }

  @ApiOperation({ summary: 'Atualizar registro de presença' })
  @ApiParam({ name: 'attendanceId', description: 'ID do registro de presença' })
  @ApiBody({ type: UpdateAttendanceDto })
  @ApiResponse({ status: 200, description: 'Presença atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Registro de presença não encontrado' })
  @Patch('attendance/:attendanceId')
  updateAttendance(
    @Param('attendanceId') attendanceId: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.biblicalSchoolService.updateAttendance(
      attendanceId,
      updateAttendanceDto,
    );
  }
}
