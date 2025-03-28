import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Review } from '../../domain/entities/review.entity';
import { v4 as uuidv4 } from 'uuid';
import { ReviewRepository } from 'src/domain/port/review.repository';
import { PerfumeRepository } from 'src/domain/port/perfume.repository';

@Injectable()
export class SubmitReviewUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly perfumeRepository: PerfumeRepository,
  ) {}

  async execute(
    perfumeId: string,
    email: string,
    rating: number,
    comment: string,
  ): Promise<Review> {
    // Validar que el perfume existe
    const perfumeExists = await this.perfumeRepository.searchById(perfumeId);
    if (!perfumeExists) {
      throw new NotFoundException(`El perfume con ID ${perfumeId} no existe.`);
    }

    // Validar que el rating sea un número entre 1 y 5
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException(`La calificación debe estar entre 1 y 5.`);
    }

    // Validar que el comentario no esté vacío ni demasiado largo
    if (!comment || comment.trim().length === 0 || comment.length > 500) {
      throw new BadRequestException(
        `El comentario es inválido (vacío o demasiado largo).`,
      );
    }

    // Validar que el email sea válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException(`El formato del email es inválido.`);
    }

    // Crear la reseña
    const review = new Review(
      uuidv4(),
      perfumeId,
      email,
      rating,
      comment,
      new Date(),
    );
    await this.reviewRepository.save(review);

    return review;
  }
}
