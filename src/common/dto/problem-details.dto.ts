import { ApiProperty } from '@nestjs/swagger';

export class ProblemDetailsDto {
  @ApiProperty({ example: 'about:blank' })
  type: string;

  @ApiProperty({ example: 'Not Found' })
  title: string;

  @ApiProperty({ example: 404 })
  status: number;

  @ApiProperty({ example: 'Place plc_xxxx introuvable' })
  detail: string;

  @ApiProperty({ example: '/api/v1/places/plc_xxxx' })
  instance: string;
}
