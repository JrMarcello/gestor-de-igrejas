import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: PrismaService;

  const mockPrismaService = {
    member: {
      count: jest.fn().mockResolvedValue(10),
    },
    group: {
      count: jest.fn().mockResolvedValue(5),
    },
    biblicalSchoolClass: {
      count: jest.fn().mockResolvedValue(3),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSummaryData', () => {
    it('should return summary data', async () => {
      const result = await service.getSummaryData();

      expect(prisma.member.count).toHaveBeenCalled();
      expect(prisma.group.count).toHaveBeenCalled();
      expect(prisma.biblicalSchoolClass.count).toHaveBeenCalled();

      expect(result).toEqual({
        totalMembers: 10,
        totalGroups: 5,
        totalBiblicalSchoolClasses: 3,
      });
    });
  });
});
