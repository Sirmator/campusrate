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
  @IsString()
  name: string;

  @IsString()
  @MaxLength(500) 
  description: string;

  @IsIn(CATEGORIES)
  category: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  services?: string[];

  @IsOptional()
  @IsIn(STATUSES)
  status?: string;
}
