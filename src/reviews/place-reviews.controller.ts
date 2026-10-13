import { Controller, Post, Get, Param, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import express from 'express';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { ProblemDetailsDto } from '../common/dto/problem-details.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@ApiTags('reviews')
@Controller('places/:placeId/reviews')
export class PlaceReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Publier une review pour un endroit' })
  @ApiParam({ name: 'placeId', example: '671f1a2b3c4d5e6f7a8b9c0d' })
  @ApiResponse({ status: 201, type: ReviewEntity })
  @ApiResponse({ status: 400, type: ProblemDetailsDto })
  @ApiResponse({ status: 404, type: ProblemDetailsDto })
  async create(
    @Param('placeId', ParseMongoIdPipe) placeId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const review = await this.reviewsService.create(placeId, createReviewDto);
    res.setHeader('Location', `/api/v1/reviews/${review._id.toString()}`);
    return review;
  }

  @Get()
  @ApiOperation({ summary: "Lister les reviews d'un endroit" })
  @ApiParam({ name: 'placeId', example: '671f1a2b3c4d5e6f7a8b9c0d' })
  @ApiResponse({ status: 200, type: [ReviewEntity] })
  @ApiResponse({ status: 400, type: ProblemDetailsDto })
  @ApiResponse({ status: 404, type: ProblemDetailsDto })
  findAll(@Param('placeId', ParseMongoIdPipe) placeId: string) {
    return this.reviewsService.findAllForPlace(placeId);
  }
}
