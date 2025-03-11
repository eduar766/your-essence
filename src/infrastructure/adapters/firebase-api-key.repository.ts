import { Injectable } from '@nestjs/common';
import { firestore } from '../config/firebase.config';

@Injectable()
export class FirebaseApiKeyRepository {
  private collection = firestore.collection('api_keys');

  async validateApiKey(apiKey: string): Promise<boolean> {
    const snapshot = await this.collection.where('key', '==', apiKey).get();
    return !snapshot.empty;
  }
}
