import { Controller, Post, Get, Param, Body, Res } from '@nestjs/common';
import express from 'express';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('places/:placeId/reviews')
export class PlaceReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(
    @Param('placeId') placeId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const review = this.reviewsService.create(placeId, createReviewDto);
    res.setHeader('Location', `/api/v1/reviews/${review.id}`);
    return review;
  }

  @Get()
  findAll(@Param('placeId') placeId: string) {
    return this.reviewsService.findAllForPlace(placeId);
  }
}
