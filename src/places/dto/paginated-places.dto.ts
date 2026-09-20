import { ApiProperty } from '@nestjs/swagger';
import { PlaceEntity } from '../entities/place.entity';

class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 25 })
  totalItems: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}

export class PaginatedPlacesDto {
  @ApiProperty({ type: [PlaceEntity] })
  data: PlaceEntity[];

  @ApiProperty({ type: PaginationMetaDto })
  pagination: PaginationMetaDto;
}
