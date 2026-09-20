import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlacesService } from '../places/places.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  private reviews: any[] = [];

  constructor(private readonly placesService: PlacesService) {}

  create(placeId: string, dto: CreateReviewDto) {
    this.placesService.findOne(placeId);

    const now = new Date().toISOString();
    const review = {
      id: `rev_${randomUUID()}`,
      placeId,
      ...dto,
      createdAt: now,
      updatedAt: now,
    };
    this.reviews.push(review);
    this.recalculatePlaceAggregates(placeId);
    return review;
  }

  findAllForPlace(placeId: string) {
    this.placesService.findOne(placeId);
    return this.reviews.filter((r) => r.placeId === placeId);
  }

  findOne(id: string) {
    const review = this.reviews.find((r) => r.id === id);
    if (!review) {
      throw new NotFoundException(`Review ${id} introuvable`);
    }
    return review;
  }

  update(id: string, dto: UpdateReviewDto) {
    const review = this.findOne(id);
    Object.assign(review, dto, { updatedAt: new Date().toISOString() });
    this.recalculatePlaceAggregates(review.placeId);
    return review;
  }

  remove(id: string) {
    const review = this.findOne(id);
    this.reviews = this.reviews.filter((r) => r.id !== id);
    this.recalculatePlaceAggregates(review.placeId);
  }

  private recalculatePlaceAggregates(placeId: string) {
    const placeReviews = this.reviews.filter((r) => r.placeId === placeId);
    const place = this.placesService.findOne(placeId);
    place.reviewCount = placeReviews.length;
    place.averageRating = placeReviews.length
      ? placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length
      : null;
  }
}
