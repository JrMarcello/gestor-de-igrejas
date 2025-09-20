import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  const mockSummaryData = {
    totalMembers: 10,
    totalGroups: 5,
    totalBiblicalSchoolClasses: 3,
  };

  const mockDashboardService = {
    getSummaryData: jest.fn().mockResolvedValue(mockSummaryData),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: mockDashboardService,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSummaryData', () => {
    it('should return summary data', async () => {
      expect(await controller.getSummaryData()).toEqual(mockSummaryData);
      expect(service.getSummaryData).toHaveBeenCalled();
    });
  });
});
