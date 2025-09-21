import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Obter resumo estatístico' })
  @ApiResponse({ 
    status: 200, 
    description: 'Resumo estatístico retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        totalMembers: {
          type: 'number',
          example: 150,
          description: 'Total de membros cadastrados'
        },
        totalGroups: {
          type: 'number',
          example: 10,
          description: 'Total de grupos e ministérios'
        },
        totalBiblicalSchoolClasses: {
          type: 'number',
          example: 5,
          description: 'Total de turmas da escola bíblica'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @Get('summary')
  getSummaryData() {
    return this.dashboardService.getSummaryData();
  }
}
