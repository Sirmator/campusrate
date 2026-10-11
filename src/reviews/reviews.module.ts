import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PlaceReviewsController } from './place-reviews.controller';
import { PlacesModule } from '../places/places.module';
import { Review, ReviewSchema } from './schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    PlacesModule,
  ],
  controllers: [ReviewsController, PlaceReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
