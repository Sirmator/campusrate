import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';

`import { AppService } from './app.service';`
import { ConfigModule } from '@nestjs/config';
import { PlacesModule } from './places/places.module';
import { ReviewsModule } from './reviews/reviews.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'campusrate',
    }),
    PlacesModule,
    ReviewsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PlacesModule,
    ReviewsModule,
  ]
})
export class AppModule {}
