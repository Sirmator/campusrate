import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, } from '@nestjs/common';
import express from 'express';
import { Res } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { QueryPlacesDto } from './dto/query-places.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  create(
    @Body() createPlaceDto: CreatePlaceDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const place = this.placesService.create(createPlaceDto);
    res.setHeader('Location', `/api/v1/places/${place.id}`);
    return place;
  }

  @Get()
  findAll(@Query() query: QueryPlacesDto) {
    return this.placesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.placesService.remove(id);
  }
}
