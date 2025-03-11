import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { SubmitReviewUseCase } from 'src/application/use-cases/submit-review.use-case';

@Controller('perfumes/:perfumeId/reviews')
export class ReviewController {
  constructor(private readonly submitReviewUseCase: SubmitReviewUseCase) {}

  @Post()
  async submitReview(
    @Param('perfumeId') perfumeId: string,
    @Body('email') email: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
  ) {
    return this.submitReviewUseCase.execute(perfumeId, email, rating, comment);
  }
}