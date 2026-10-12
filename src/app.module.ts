import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';
import { PlacesModule } from './places/places.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        CORS_ORIGINS: Joi.string(),
        THROTTLE_TTL: Joi.number().integer().min(1).default(60000),
        THROTTLE_LIMIT: Joi.number().integer().min(1).default(100),
      }).custom((env: { NODE_ENV?: string; CORS_ORIGINS?: string }) => {
        if (env.NODE_ENV === 'production' && !env.CORS_ORIGINS) {
          throw new Error('CORS_ORIGINS est obligatoire en production');
        }
        return env;
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL', 60000),
          limit: configService.get<number>('THROTTLE_LIMIT', 100),
        },
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),
    DatabaseModule,
    PlacesModule,
    ReviewsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
