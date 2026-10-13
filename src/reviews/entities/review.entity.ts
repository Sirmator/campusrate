import { ApiProperty } from '@nestjs/swagger';

export class ReviewEntity {
  @ApiProperty({
    example: '671f2b3c4d5e6f7a8b9c0d1e',
    description:
      'Identifiant MongoDB (24 caracteres hexadecimaux), genere par le serveur',
  })
  id: string;

  @ApiProperty({
    example: '671f1a2b3c4d5e6f7a8b9c0d',
    description: 'Identifiant du place associe, non modifiable',
  })
  placeId: string;

  @ApiProperty({ example: 'Samira' })
  authorName: string;

  @ApiProperty({ example: 4 })
  rating: number;

  @ApiProperty({ example: 'Calme et Wi-Fi stable dans cette salle.' })
  comment: string;

  @ApiProperty({ example: '2026-10-11T19:50:12.331Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-10-11T19:50:12.331Z' })
  updatedAt: string;
}
