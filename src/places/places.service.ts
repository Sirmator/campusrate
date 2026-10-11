import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlacesRepository, PlaceFilter } from './places.repository';
import { Review } from '../reviews/schemas/review.schema';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { QueryPlacesDto } from './dto/query-places.dto';

@Injectable()
export class PlacesService {
  constructor(
    private readonly placesRepository: PlacesRepository,
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}

  async create(dto: CreatePlaceDto) {
    return this.placesRepository.create({
      name: dto.name,
      description: dto.description,
      category: dto.category,
      address: dto.address,
      services: dto.services ?? [],
      status: dto.status ?? 'ACTIVE',
    });
  }

  async findAll(query: QueryPlacesDto) {
    const filter: PlaceFilter = {};
    if (query.category !== undefined) {
      filter.category = query.category;
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, totalItems] = await Promise.all([
      this.placesRepository.findAll(filter, skip, limit),
      this.placesRepository.count(filter),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit) || 0,
      },
    };
  }

  async findOne(id: string) {
    const place = await this.placesRepository.findById(id);
    if (!place) {
      throw new NotFoundException(`Place ${id} introuvable`);
    }
    return place;
  }

  async update(id: string, dto: UpdatePlaceDto) {
    const place = await this.placesRepository.updateById(id, dto);
    if (!place) {
      throw new NotFoundException(`Place ${id} introuvable`);
    }
    return place;
  }

  async remove(id: string) {
    await this.findOne(id);

    const reviewCount = await this.reviewModel
      .countDocuments({ placeId: id })
      .exec();
    if (reviewCount > 0) {
      throw new ConflictException(
        `Place ${id} possede des reviews et ne peut pas etre supprime`,
      );
    }

    await this.placesRepository.deleteById(id);
  }

  async updateAggregates(
    id: string,
    data: { averageRating: number | null; reviewCount: number },
  ) {
    await this.placesRepository.updateById(id, data);
  }
}
