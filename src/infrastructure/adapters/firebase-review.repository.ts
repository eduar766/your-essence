import { Injectable } from '@nestjs/common';
import { Review } from '../../domain/entities/review.entity';
import { firestore } from '../config/firebase.config';
import { ReviewRepository } from 'src/domain/port/review.repository';

@Injectable()
export class FirebaseReviewRepository extends ReviewRepository {
  private collection = firestore.collection('reviews');

  async save(review: Review): Promise<void> {
    await this.collection.doc(review.id).set({
      perfumeId: review.perfumeId,
      email: review.email,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    });
  }

  async findByPerfumeId(perfumeId: string): Promise<Review[]> {
    const snapshot = await this.collection
      .where('perfumeId', '==', perfumeId)
      .get();
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Review(
        doc.id,
        data.perfumeId,
        data.email,
        data.rating,
        data.comment,
        data.createdAt.toDate(),
      );
    });
  }
}
