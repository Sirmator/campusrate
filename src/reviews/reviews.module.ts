import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PlaceReviewsController } from './place-reviews.controller';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [PlacesModule],
  controllers: [ReviewsController, PlaceReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
