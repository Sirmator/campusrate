import { IsString, IsInt, Min, Max, MinLength, MaxLength } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  authorName: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  comment: string;
}
