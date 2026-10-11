import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { PlacesService } from '../places/places.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly placesService: PlacesService,
  ) {}

  async create(placeId: string, dto: CreateReviewDto) {
    await this.placesService.findOne(placeId);

    const review = await this.reviewsRepository.create({
      placeId,
      authorName: dto.authorName,
      rating: dto.rating,
      comment: dto.comment,
    });

    await this.recalculateAggregates(placeId);
    return review;
  }

  async findAllForPlace(placeId: string) {
    await this.placesService.findOne(placeId);
    return this.reviewsRepository.findAllForPlace(placeId);
  }

  async findOne(id: string) {
    const review = await this.reviewsRepository.findById(id);
    if (!review) {
      throw new NotFoundException(`Review ${id} introuvable`);
    }
    return review;
  }

  async update(id: string, dto: UpdateReviewDto) {
    const review = await this.reviewsRepository.updateById(id, dto);
    if (!review) {
      throw new NotFoundException(`Review ${id} introuvable`);
    }
    await this.recalculateAggregates(review.placeId);
    return review;
  }

  async remove(id: string) {
    const review = await this.findOne(id);
    await this.reviewsRepository.deleteById(id);
    await this.recalculateAggregates(review.placeId);
  }

  private async recalculateAggregates(placeId: string) {
    const reviews = await this.reviewsRepository.findAllForPlace(placeId);
    const reviewCount = reviews.length;
    const averageRating = reviewCount
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : null;
    await this.placesService.updateAggregates(placeId, {
      averageRating,
      reviewCount,
    });
  }
}
