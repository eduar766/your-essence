import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController, ApiKeyController, PerfumeController],
  providers: [
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
  ],
})
export class AppModule {}
