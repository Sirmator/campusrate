import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsOptional, IsArray, ArrayUnique, MaxLength, } from 'class-validator';

const CATEGORIES = [
  'STUDY_SPACE',
  'LIBRARY',
  'FOOD_SERVICE',
  'SPORTS',
  'STUDENT_SERVICE',
  'COMPUTER_LAB',
  'OTHER',
];
const STATUSES = ['ACTIVE', 'TEMPORARILY_CLOSED', 'INACTIVE'];

export class CreatePlaceDto {
  @ApiProperty({ example: 'Bibliotheque principale' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Espace calme avec prises.' })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({ enum: CATEGORIES, example: 'LIBRARY' })
  @IsIn(CATEGORIES)
  category: string;

  @ApiProperty({ example: 'Pavillon A, local A-210' })
  @IsString()
  address: string;

  @ApiProperty({
    example: ['WIFI', 'POWER_OUTLETS'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  services?: string[];

  @ApiProperty({ enum: STATUSES, required: false, example: 'ACTIVE' })
  @IsOptional()
  @IsIn(STATUSES)
  status?: string;
}
