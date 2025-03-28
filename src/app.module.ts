import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiKeyController } from './infrastructure/controllers/api-key.controller';
import { GenerateApiKeyUseCase } from './application/use-cases/generate-api-key.use-case';
import { FirebaseApiKeyRepository } from './infrastructure/adapters/firebase-api-key.repository';
import { AbstractApiKeyRepository } from './domain/port/abstract-api-key.repository';
import {
  ThrottlerGuard,
  ThrottlerModule,
  ThrottlerStorageService,
} from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PerfumeController } from './infrastructure/controllers/perfume.controller';
import { SearchPerfumeUseCase } from './application/use-cases/search-perfume.use-case';
import { FirebasePerfumeRepository } from './infrastructure/adapters/firebase-perfume.repository';
import { PerfumeRepository } from './domain/port/perfume.repository';
import { PopulatePerfumeUseCase } from './application/use-cases/populate-perfume.use-case';
import { OpenAIService } from './infrastructure/adapters/openai.service';
import { ReviewController } from './infrastructure/controllers/review.controller';
import { SubmitReviewUseCase } from './application/use-cases/submit-review.use-case';
import { FirebaseReviewRepository } from './infrastructure/adapters/firebase-review.repository';
import { ReviewRepository } from './domain/port/review.repository';
import { ApiKeyMiddleware } from './infrastructure/middleware/api-key.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
  ],
  controllers: [
    AppController,
    ApiKeyController,
    PerfumeController,
    ReviewController,
  ],
  providers: [
    FirebaseApiKeyRepository,
    AppService,
    GenerateApiKeyUseCase,
    { provide: AbstractApiKeyRepository, useClass: FirebaseApiKeyRepository },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    ThrottlerStorageService,
    SearchPerfumeUseCase,
    { provide: PerfumeRepository, useClass: FirebasePerfumeRepository },
    PopulatePerfumeUseCase,
    { provide: PerfumeRepository, useClass: FirebasePerfumeRepository },
    OpenAIService,
    SubmitReviewUseCase,
    { provide: ReviewRepository, useClass: FirebaseReviewRepository },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      .exclude({ path: 'api-keys', method: RequestMethod.POST }) // Permitir generar API Keys sin validación
      .forRoutes(ApiKeyController, PerfumeController, ReviewController);
  }
}
