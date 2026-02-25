import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PatientRepository } from './repository/patient.repository';
import { PatientValidationService } from './validation/patient-validation.service';

@Module({
  controllers: [PatientController],
  providers: [PatientService, PatientRepository, PatientValidationService],
  exports: [PatientService],
})
export class PatientModule {}
