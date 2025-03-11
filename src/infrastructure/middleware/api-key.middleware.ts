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
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || typeof apiKey !== 'string') {
      throw new UnauthorizedException('API Key requerida');
    }

    const isValid = await this.apiKeyRepository.validateApiKey(apiKey);
    if (!isValid) {
      throw new UnauthorizedException('API Key inválida');
    }

    next();
  }
}
