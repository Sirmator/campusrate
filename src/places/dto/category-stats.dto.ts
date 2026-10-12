import { ApiProperty } from '@nestjs/swagger';

export class CategoryStatsDto {
  @ApiProperty({ example: 'LIBRARY' })
  category: string;

  @ApiProperty({
    example: 3,
    description: "Nombre d'endroits dans la categorie",
  })
  placeCount: number;

  @ApiProperty({
    example: 12,
    description: 'Nombre total de reviews des endroits de la categorie',
  })
  reviewCount: number;

  @ApiProperty({
    example: 4.25,
    nullable: true,
    type: Number,
    description:
      "Moyenne des notes moyennes des endroits notes, null si aucun endroit n'est note",
  })
  averageRating: number | null;
}
