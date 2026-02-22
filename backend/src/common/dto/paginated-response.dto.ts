import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export function PaginatedDto<T>(ItemDto: Type<T>) {
  class PaginatedResponseDto {
    @ApiProperty({ type: [ItemDto] })
    items: T[];

    @ApiProperty()
    total: number;
  }

  return PaginatedResponseDto;
}
