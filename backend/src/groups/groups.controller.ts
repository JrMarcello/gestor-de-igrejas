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

@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }

  @Post(':id/members')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content para sucesso na adição
  addMember(
    @Param('id') groupId: string,
    @Body() assignMemberDto: AssignMemberDto,
  ) {
    return this.groupsService.addMember(groupId, assignMemberDto.memberId);
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content para sucesso na remoção
  removeMember(
    @Param('id') groupId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.groupsService.removeMember(groupId, memberId);
  }
}
