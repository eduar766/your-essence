import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubmitReviewUseCase } from 'src/application/use-cases/submit-review.use-case';

@ApiTags('Reseñas')
@Controller('perfumes/:perfumeId/reviews')
export class ReviewController {
  constructor(private readonly submitReviewUseCase: SubmitReviewUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Enviar una reseña para un perfume' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@example.com' },
        rating: { type: 'integer', example: 5 },
        comment: { type: 'string', example: 'Este perfume tiene un aroma increíble.' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Reseña enviada correctamente' })
  async submitReview(
    @Param('perfumeId') perfumeId: string,
    @Body('email') email: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
  ) {
    return this.submitReviewUseCase.execute(perfumeId, email, rating, comment);
  }
}