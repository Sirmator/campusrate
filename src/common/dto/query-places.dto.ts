import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsIn, IsInt, Min, Max } from 'class-validator';

const CATEGORIES = [
  'STUDY_SPACE',
  'LIBRARY',
  'FOOD_SERVICE',
  'SPORTS',
  'STUDENT_SERVICE',
  'COMPUTER_LAB',
  'OTHER',
];

export class QueryPlacesDto {
  @ApiPropertyOptional({ enum: CATEGORIES })
  @IsOptional()
  @IsIn(CATEGORIES)
  category?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}
