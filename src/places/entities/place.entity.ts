import { ApiProperty } from '@nestjs/swagger';

export class PlaceEntity {
  @ApiProperty({ example: 'plc_7dd054fa-207c-4e5b-b293-e58a997bef5d' })
  id: string;

  @ApiProperty({ example: 'Bibliotheque principale' })
  name: string;

  @ApiProperty({ example: 'Espace calme avec prises.' })
  description: string;

  @ApiProperty({ example: 'LIBRARY' })
  category: string;

  @ApiProperty({ example: 'Pavillon A, local A-210' })
  address: string;

  @ApiProperty({ example: ['WIFI', 'POWER_OUTLETS'], type: [String] })
  services: string[];

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: 4.25, nullable: true, type: Number })
  averageRating: number | null;

  @ApiProperty({ example: 12 })
  reviewCount: number;

  @ApiProperty({ example: '2026-09-18T17:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-09-18T17:30:00.000Z' })
  updatedAt: string;
}
