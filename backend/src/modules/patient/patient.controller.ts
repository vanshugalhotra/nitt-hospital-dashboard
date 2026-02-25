import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import {
  PaginatedPatientResponse,
  PatientResponseDto,
} from './dto/patient-response.dto';
import { QueryOptionsDto } from 'src/common/dto/query-options.dto';
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.gaurd';
import { PermissionsGuard } from '../auth/gaurds/permission.gaurd';
import { Permission } from '../auth/decorators/permission.decorator';
import { PERMISSIONS } from '../auth/rbac/role-permissions.map';

@ApiTags('Patients')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'patient', version: '1' })
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  // ────────────────────────────────────────────────
  // CREATE PATIENT
  // ────────────────────────────────────────────────
  @Post()
  @UseGuards(PermissionsGuard)
  @Permission(PERMISSIONS.PATIENT_CREATE)
  @ApiOperation({ summary: 'Create new patient' })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({
    status: 201,
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Patient with same email or identifier already exists',
  })
  async create(@Body() dto: CreatePatientDto): Promise<PatientResponseDto> {
    return this.patientService.create(dto);
  }

  // ────────────────────────────────────────────────
  // GET ALL PATIENTS
  // ────────────────────────────────────────────────
  @Get()
  @UseGuards(PermissionsGuard)
  @Permission(PERMISSIONS.PATIENT_READ)
  @ApiOperation({ summary: 'Get paginated list of patients' })
  @ApiQuery({ type: QueryOptionsDto })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of patients',
  })
  async findAll(
    @Query() query: QueryOptionsDto,
  ): Promise<PaginatedPatientResponse> {
    return this.patientService.findAll(query);
  }

  // ────────────────────────────────────────────────
  // GET ONE PATIENT
  // ────────────────────────────────────────────────
  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permission(PERMISSIONS.PATIENT_READ)
  @ApiOperation({ summary: 'Get patient by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PatientResponseDto> {
    return this.patientService.findOne(id);
  }

  // ────────────────────────────────────────────────
  // UPDATE PATIENT
  // ────────────────────────────────────────────────
  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permission(PERMISSIONS.PATIENT_UPDATE)
  @ApiOperation({ summary: 'Update patient' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({
    status: 200,
    description: 'Patient updated successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict (duplicate email / identifier)',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    return this.patientService.update(id, dto);
  }

  // ────────────────────────────────────────────────
  // REMOVE PATIENT (Soft Delete)
  // ────────────────────────────────────────────────
  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permission(PERMISSIONS.PATIENT_DELETE)
  @ApiOperation({ summary: 'Deactivate patient (soft delete)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Patient deactivated successfully',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PatientResponseDto> {
    return this.patientService.remove(id);
  }
}
