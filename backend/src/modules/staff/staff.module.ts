import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { StaffRepository } from './repository/staff.repository';
import { StaffValidationService } from './validation/staff-validation.service';

@Module({
  controllers: [StaffController],
  providers: [StaffService, StaffRepository, StaffValidationService],
  exports: [StaffService],
})
export class StaffModule {}
