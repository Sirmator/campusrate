import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlacesService } from '../places/places.service';
import { DataStoreService, DataStore, Place, Review, } from '../common/persistence/data-store.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly placesService: PlacesService,
    private readonly dataStore: DataStoreService,
  ) {}

  async create(placeId: string, dto: CreateReviewDto) {
    await this.placesService.findOne(placeId);

    const data = await this.dataStore.read();
    const now = new Date().toISOString();
    const review = {
      id: `rev_${randomUUID()}`,
      placeId,
      ...dto,
      createdAt: now,
      updatedAt: now,
    };
    data.reviews.push(review);
    this.recalculateAggregates(data, placeId);
    await this.dataStore.write(data);
    return review;
  }

  async findAllForPlace(placeId: string) {
    await this.placesService.findOne(placeId);
    const data = await this.dataStore.read();
    return data.reviews.filter((r) => r.placeId === placeId);
  }

  async findOne(id: string) {
    const data = await this.dataStore.read();
    return this.findReviewOrThrow(data, id);
  }

  async update(id: string, dto: UpdateReviewDto) {
    const data = await this.dataStore.read();
    const review = this.findReviewOrThrow(data, id);
    Object.assign(review, dto, { updatedAt: new Date().toISOString() });
    this.recalculateAggregates(data, review.placeId);
    await this.dataStore.write(data);
    return review;
  }

  async remove(id: string) {
    const data = await this.dataStore.read();
    const review = this.findReviewOrThrow(data, id);
    data.reviews = data.reviews.filter((r) => r.id !== id);
    this.recalculateAggregates(data, review.placeId);
    await this.dataStore.write(data);
  }

  private findReviewOrThrow(data: DataStore, id: string): Review {
    const review = data.reviews.find((r) => r.id === id);
    if (!review) {
      throw new NotFoundException(`Review ${id} introuvable`);
    }
    return review;
  }

  private recalculateAggregates(data: DataStore, placeId: string) {
    const placeReviews = data.reviews.filter((r) => r.placeId === placeId);
    const place = data.places.find((p) => p.id === placeId);
    place!.reviewCount = placeReviews.length;
    place!.averageRating = placeReviews.length
      ? placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length
      : null;
  }
}
