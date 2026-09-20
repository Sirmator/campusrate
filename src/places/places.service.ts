import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { QueryPlacesDto } from './dto/query-places.dto';

@Injectable()
export class PlacesService {
  private places: any[] = []; // je dois mettre le JSON apres ici.

  create(dto: CreatePlaceDto) {
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
    this.places.push(place);
    return place;
  }

  findAll(query: QueryPlacesDto) {
    let results = this.places;

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

  findOne(id: string) {
    const place = this.places.find((p) => p.id === id);
    if (!place) {
      throw new NotFoundException(`Place ${id} introuvable`);
    }
    return place;
  }

  update(id: string, dto: UpdatePlaceDto) {
    const place = this.findOne(id);
    Object.assign(place, dto, { updatedAt: new Date().toISOString() });
    return place;
  }

  remove(id: string) {
    const place = this.findOne(id); // leve 404 si absent

    // TODO (etape persistance) : verifier ici si des reviews referencent ce place.id
    // et lancer new ConflictException(...) si c'est le cas (regle metier #6, code 409)

    this.places = this.places.filter((p) => p.id !== id);
  }
}
