import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place } from './schemas/place.schema';
import { CategoryStatsDto } from './dto/category-stats.dto';

export type PlaceFilter = {
  category?: string;
};

@Injectable()
export class PlacesRepository {
  constructor(
    @InjectModel(Place.name) private readonly placeModel: Model<Place>,
  ) {}

  async findAll(
    filter: PlaceFilter,
    skip: number,
    limit: number,
  ): Promise<Place[]> {
    return this.placeModel.find(filter).skip(skip).limit(limit).exec();
  }

  async count(filter: PlaceFilter): Promise<number> {
    return this.placeModel.countDocuments(filter).exec();
  }

  async findById(id: string): Promise<Place | null> {
    return this.placeModel.findById(id).exec();
  }

  async create(data: Partial<Place>): Promise<Place> {
    return this.placeModel.create(data);
  }

  async updateById(id: string, data: Partial<Place>): Promise<Place | null> {
    return this.placeModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.placeModel.findByIdAndDelete(id).exec();
  }

  async statsByCategory(): Promise<CategoryStatsDto[]> {
    return this.placeModel
      .aggregate<CategoryStatsDto>([
        {
          $group: {
            _id: '$category',
            placeCount: { $sum: 1 },
            reviewCount: { $sum: '$reviewCount' },
            averageRating: { $avg: '$averageRating' },
          },
        },
        {
          $project: {
            _id: 0,
            category: '$_id',
            placeCount: 1,
            reviewCount: 1,
            averageRating: { $round: ['$averageRating', 2] },
          },
        },
        { $sort: { category: 1 } },
      ])
      .exec();
  }
}
