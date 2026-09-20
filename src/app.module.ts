import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlacesModule } from './places/places.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PlacesModule,
    ReviewsModule,
  ],
})
export class AppModule {}
