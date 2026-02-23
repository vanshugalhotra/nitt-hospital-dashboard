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
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffUser } from '@prisma/client';
import { PaginatedStaffResponse } from './dto/staff-response.dto';
import { QueryOptionsDto } from 'src/common/dto/query-options.dto';

@ApiTags('Staff')
@Controller({ path: 'staff', version: '1' })
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // ────────────────────────────────────────────────
  // CREATE STAFF
  // ────────────────────────────────────────────────
  @Post()
  @ApiOperation({ summary: 'Create new staff user' })
  @ApiResponse({
    status: 201,
    description: 'Staff created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Staff with same email already exists',
  })
  async create(@Body() dto: CreateStaffDto): Promise<StaffUser> {
    return this.staffService.create(dto);
  }

  // ────────────────────────────────────────────────
  // GET ALL STAFF
  // ────────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'Get paginated list of staff users' })
  @ApiResponse({
    status: 200,
    description: 'Staff list fetched successfully',
  })
  async findAll(
    @Query() query: QueryOptionsDto,
  ): Promise<PaginatedStaffResponse> {
    return this.staffService.findAll(query);
  }

  // ────────────────────────────────────────────────
  // GET ONE STAFF
  // ────────────────────────────────────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Get staff by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Staff fetched successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Staff not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StaffUser> {
    return this.staffService.findOne(id);
  }

  // ────────────────────────────────────────────────
  // UPDATE STAFF
  // ────────────────────────────────────────────────
  @Patch(':id')
  @ApiOperation({ summary: 'Update staff user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Staff updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Staff not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict (email duplicate / last admin protection)',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStaffDto,
  ): Promise<StaffUser> {
    // For now, actingUserId is passed as id itself (temporary until auth is added)
    return this.staffService.update(id, dto, id);
  }

  // ────────────────────────────────────────────────
  // REMOVE STAFF (Soft Delete)
  // ────────────────────────────────────────────────
  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate staff user (soft delete)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Staff deactivated successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot deactivate last active admin',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<StaffUser> {
    // Temporary actingUserId = id (replace after auth)
    return this.staffService.remove(id, id);
  }
}
