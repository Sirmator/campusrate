import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max, MinLength, MaxLength, } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'Samira', minLength: 2, maxLength: 100 })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  authorName: string;

  @ApiProperty({
    example: 4,
    minimum: 1,
    maximum: 5,
    description: 'Entier de 1 a 5',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'Calme et Wi-Fi stable dans cette salle.',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  comment: string;
}
