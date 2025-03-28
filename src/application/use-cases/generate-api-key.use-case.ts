import { Injectable } from '@nestjs/common';
import { AbstractApiKeyRepository } from 'src/domain/port/abstract-api-key.repository';

@Injectable()
export class GenerateApiKeyUseCase {
  constructor(private readonly apiKeyRepository: AbstractApiKeyRepository) {}

  async execute(email: string): Promise<{ apiKey: string }> {
    const existingKey = await this.apiKeyRepository.findByEmail(email);
    if (existingKey) return { apiKey: existingKey };

    const newKey = `essence-${Math.random().toString(36).substr(2, 10)}`;
    await this.apiKeyRepository.save(email, newKey);
    return { apiKey: newKey };
  }
}
