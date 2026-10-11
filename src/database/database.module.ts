import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from '../places/schemas/place.schema';
import { Review, ReviewSchema } from '../reviews/schemas/review.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Place.name, schema: PlaceSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
