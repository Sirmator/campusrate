import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}

  async findAllForPlace(placeId: string): Promise<Review[]> {
    return this.reviewModel.find({ placeId }).exec();
  }

  async findById(id: string): Promise<Review | null> {
    return this.reviewModel.findById(id).exec();
  }

  async create(data: Partial<Review>): Promise<Review> {
    return this.reviewModel.create(data);
  }

  async updateById(id: string, data: Partial<Review>): Promise<Review | null> {
    return this.reviewModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.reviewModel.findByIdAndDelete(id).exec();
  }

  async countForPlace(placeId: string): Promise<number> {
    return this.reviewModel.countDocuments({ placeId }).exec();
  }
}
