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
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import {
  PaginatedStaffResponse,
  StaffResponseDto,
} from './dto/staff-response.dto';
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
  @ApiBody({ type: CreateStaffDto })
  @ApiResponse({
    status: 201,
    type: StaffResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Staff with same email already exists',
  })
  async create(@Body() dto: CreateStaffDto): Promise<StaffResponseDto> {
    return this.staffService.create(dto);
  }

  // ────────────────────────────────────────────────
  // GET ALL STAFF
  // ────────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'Get paginated list of staff users' })
  @ApiQuery({ type: QueryOptionsDto })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of staff users',
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
    type: StaffResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Staff not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StaffResponseDto> {
    return this.staffService.findOne(id);
  }

  // ────────────────────────────────────────────────
  // UPDATE STAFF
  // ────────────────────────────────────────────────
  @Patch(':id')
  @ApiOperation({ summary: 'Update staff user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateStaffDto })
  @ApiResponse({
    status: 200,
    description: 'Staff updated successfully',
    type: StaffResponseDto,
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
  ): Promise<StaffResponseDto> {
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
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StaffResponseDto> {
    // Temporary actingUserId = id (replace after auth)
    return this.staffService.remove(id, id);
  }
}
