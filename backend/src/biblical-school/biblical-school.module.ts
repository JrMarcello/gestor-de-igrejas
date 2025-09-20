import { Module } from '@nestjs/common';
import { BiblicalSchoolController } from './biblical-school.controller';
import { BiblicalSchoolService } from './biblical-school.service';

@Module({
  controllers: [BiblicalSchoolController],
  providers: [BiblicalSchoolService]
})
export class BiblicalSchoolModule {}
