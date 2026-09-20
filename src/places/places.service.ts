import { Injectable, NotFoundException, ConflictException, } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataStoreService, DataStore, Place, } from '../common/persistence/data-store.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { QueryPlacesDto } from './dto/query-places.dto';

@Injectable()
export class PlacesService {
  constructor(private readonly dataStore: DataStoreService) {}

  async create(dto: CreatePlaceDto) {
    const data = await this.dataStore.read();
    const now = new Date().toISOString();
    const place = {
      id: `plc_${randomUUID()}`,
      ...dto,
      services: dto.services ?? [],
      status: dto.status ?? 'ACTIVE',
      averageRating: null,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    data.places.push(place);
    await this.dataStore.write(data);
    return place;
  }

  async findAll(query: QueryPlacesDto) {
    const data = await this.dataStore.read();
    let results = data.places;

    if (query.category) {
      results = results.filter((p) => p.category === query.category);
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const totalItems = results.length;
    const totalPages = Math.ceil(totalItems / limit) || 0;
    const start = (page - 1) * limit;
    const paginated = results.slice(start, start + limit);

    return {
      data: paginated,
      pagination: { page, limit, totalItems, totalPages },
    };
  }

  async findOne(id: string) {
    const data = await this.dataStore.read();
    return this.findPlaceOrThrow(data, id);
  }

  async update(id: string, dto: UpdatePlaceDto) {
    const data = await this.dataStore.read();
    const place = this.findPlaceOrThrow(data, id);
    Object.assign(place, dto, { updatedAt: new Date().toISOString() });
    await this.dataStore.write(data);
    return place;
  }

  async remove(id: string) {
    const data = await this.dataStore.read();
    this.findPlaceOrThrow(data, id);

    const hasReviews = data.reviews.some((r) => r.placeId === id);
    if (hasReviews) {
      throw new ConflictException(
        `Place ${id} possede des reviews et ne peut pas etre supprime`,
      );
    }

    data.places = data.places.filter((p) => p.id !== id);
    await this.dataStore.write(data);
  }

  private findPlaceOrThrow(data: any, id: string) {
    const place = data.places.find((p: { id: string }) => p.id === id);
    if (!place) {
      throw new NotFoundException(`Place ${id} introuvable`);
    }
    return place;
  }
}
