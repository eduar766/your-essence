import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FirebaseApiKeyRepository } from '../adapters/firebase-api-key.repository';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly apiKeyRepository: FirebaseApiKeyRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) throw new UnauthorizedException('API Key is required');

    const existingKey = await this.apiKeyRepository.findByEmail(apiKey);
    if (!existingKey) throw new UnauthorizedException('Invalid API Key');

    next();
  }
}
