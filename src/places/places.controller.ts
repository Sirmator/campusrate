import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import express from 'express';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { QueryPlacesDto } from './dto/query-places.dto';
import { PaginatedPlacesDto } from './dto/paginated-places.dto';
import { PlaceEntity } from './entities/place.entity';
import { ProblemDetailsDto } from '../common/dto/problem-details.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @ApiOperation({ summary: 'Creer un nouvel endroit' })
  @ApiResponse({ status: 201, type: PlaceEntity })
  @ApiResponse({ status: 400, type: ProblemDetailsDto })
  async create(
    @Body() createPlaceDto: CreatePlaceDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const place = await this.placesService.create(createPlaceDto);
    res.setHeader('Location', `/api/v1/places/${place._id}`);
    return place;
  }

  @Get()
  @ApiOperation({ summary: 'Lister les endroits, avec filtre et pagination' })
  @ApiResponse({ status: 200, type: PaginatedPlacesDto })
  @ApiResponse({ status: 400, type: ProblemDetailsDto })
  findAll(@Query() query: QueryPlacesDto) {
    return this.placesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter un endroit' })
  @ApiParam({ name: 'id', example: '671f1a2b3c4d5e6f7a8b9c0d' })
  @ApiResponse({ status: 200, type: PlaceEntity })
  @ApiResponse({ status: 400, type: ProblemDetailsDto })
  @ApiResponse({ status: 404, type: ProblemDetailsDto })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier partiellement un endroit' })
  @ApiParam({ name: 'id', example: '671f1a2b3c4d5e6f7a8b9c0d' })
  @ApiResponse({ status: 200, type: PlaceEntity })
  @ApiResponse({ status: 400, type: ProblemDetailsDto })
  @ApiResponse({ status: 404, type: ProblemDetailsDto })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un endroit (refuse si des reviews existent)',
  })
  @ApiParam({ name: 'id', example: '671f1a2b3c4d5e6f7a8b9c0d' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 400, type: ProblemDetailsDto })
  @ApiResponse({ status: 404, type: ProblemDetailsDto })
  @ApiResponse({ status: 409, type: ProblemDetailsDto })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.placesService.remove(id);
  }
}
