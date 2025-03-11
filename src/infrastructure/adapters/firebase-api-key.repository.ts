import { Injectable } from '@nestjs/common';
import { firestore } from '../config/firebase.config';

@Injectable()
export class FirebaseApiKeyRepository {
  private collection = firestore.collection('api_keys');

  async validateApiKey(apiKey: string): Promise<boolean> {
    const snapshot = await this.collection.where('key', '==', apiKey).get();
    return !snapshot.empty;
  }

  async findByEmail(email: string): Promise<any> {
    const snapshot = await this.collection.where('email', '==', email).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data(); // Retornar el primer documento encontrado
  }

  async save(email: string, apiKey: string): Promise<void> {
    await this.collection.doc(email).set({ email: email, key: apiKey });
  }
}
