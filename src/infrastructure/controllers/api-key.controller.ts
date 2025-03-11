import { Controller, Post, Body } from '@nestjs/common';
import { GenerateApiKeyUseCase } from '../../application/use-cases/generate-api-key.use-case';
import { Throttle } from '@nestjs/throttler';

@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly generateApiKeyUseCase: GenerateApiKeyUseCase) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async generate(@Body('email') email: string) {
    const apiKey = await this.generateApiKeyUseCase.execute(email);
    return { apiKey: apiKey.apiKey };
  }
}
