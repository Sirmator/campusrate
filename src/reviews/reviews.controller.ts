import { Controller, Get, Patch, Delete, Param, Body, HttpCode, HttpStatus, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { ProblemDetailsDto } from '../common/dto/problem-details.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Consulter une review' })
  @ApiParam({ name: 'id', example: 'rev_01JXYZ789' })
  @ApiResponse({ status: 200, type: ReviewEntity })
  @ApiResponse({ status: 404, type: ProblemDetailsDto })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier partiellement une review' })
  @ApiParam({ name: 'id', example: 'rev_01JXYZ789' })
  @ApiResponse({ status: 200, type: ReviewEntity })
  @ApiResponse({ status: 400, type: ProblemDetailsDto })
  @ApiResponse({ status: 404, type: ProblemDetailsDto })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une review' })
  @ApiParam({ name: 'id', example: 'rev_01JXYZ789' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, type: ProblemDetailsDto })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
