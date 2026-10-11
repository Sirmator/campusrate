import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { ProblemDetailsDto } from '../common/dto/problem-details.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Consulter une review' })
  @ApiParam({ name: 'id', example: '671f2b3c4d5e6f7a8b9c0d1e' })
  @ApiResponse({ status: 200, type: ReviewEntity })
  @ApiResponse({ status: 400, type: ProblemDetailsDto })
  @ApiResponse({ status: 404, type: ProblemDetailsDto })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier partiellement une review' })
  @ApiParam({ name: 'id', example: '671f2b3c4d5e6f7a8b9c0d1e' })
  @ApiResponse({ status: 200, type: ReviewEntity })
  @ApiResponse({ status: 400, type: ProblemDetailsDto })
  @ApiResponse({ status: 404, type: ProblemDetailsDto })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une review' })
  @ApiParam({ name: 'id', example: '671f2b3c4d5e6f7a8b9c0d1e' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 400, type: ProblemDetailsDto })
  @ApiResponse({ status: 404, type: ProblemDetailsDto })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.reviewsService.remove(id);
  }
}
