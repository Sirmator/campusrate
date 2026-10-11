import { ApiProperty } from '@nestjs/swagger';

export class PlaceEntity {
  @ApiProperty({
    example: '671f1a2b3c4d5e6f7a8b9c0d',
    description:
      'Identifiant MongoDB (24 caracteres hexadecimaux), genere par le serveur',
  })
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

  @ApiProperty({
    example: 4.25,
    nullable: true,
    type: Number,
    description: 'Calculee par le serveur, null si aucune review',
  })
  averageRating: number | null;

  @ApiProperty({ example: 12, description: 'Calcule par le serveur' })
  reviewCount: number;

  @ApiProperty({ example: '2026-10-11T19:45:35.045Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-10-11T19:45:35.045Z' })
  updatedAt: string;
}
