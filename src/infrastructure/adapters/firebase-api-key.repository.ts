import { Injectable } from '@nestjs/common';
import { AbstractApiKeyRepository } from 'src/domain/port/abstract-api-key.repository';
import { firestore } from '../config/firebase.config';

@Injectable()
export class FirebaseApiKeyRepository extends AbstractApiKeyRepository {
  private collection = firestore.collection('api_keys');

  async findByEmail(email: string): Promise<string | null> {
    const snapshot = await this.collection.where('email', '==', email).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data().key;
  }

  async save(email: string, apiKey: string): Promise<void> {
    await this.collection
      .doc(encodeURIComponent(email))
      .set({ email, key: apiKey, createdAt: new Date() });
  }
}
