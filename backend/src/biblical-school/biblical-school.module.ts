import { Module } from '@nestjs/common';
import { BiblicalSchoolController } from './biblical-school.controller';
import { BiblicalSchoolService } from './biblical-school.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BiblicalSchoolController],
  providers: [BiblicalSchoolService],
})
export class BiblicalSchoolModule {}
