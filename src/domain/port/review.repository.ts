import { Review } from '../entities/review.entity';

export abstract class ReviewRepository {
  abstract save(review: Review): Promise<void>;
  abstract findByPerfumeId(perfumeId: string): Promise<Review[]>;
}
