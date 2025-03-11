import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SearchPerfumeUseCase } from '../../application/use-cases/search-perfume.use-case';
import { PopulatePerfumeUseCase } from 'src/application/use-cases/populate-perfume.use-case';

@Controller('perfumes')
export class PerfumeController {
  constructor(
    private readonly searchPerfumeUseCase: SearchPerfumeUseCase,
    private readonly populatePerfumeUseCase: PopulatePerfumeUseCase,
  ) {}

  @Get('search')
  async search(
    @Query('name') name?: string,
    @Query('brand') brand?: string,
    @Query('season') season?: string,
    @Query('id') id?: string,
  ) {
    if (name) return this.searchPerfumeUseCase.searchByName(name);
    if (brand) return this.searchPerfumeUseCase.searchByBrand(brand);
    if (season) return this.searchPerfumeUseCase.searchBySeason(season);
    if (id) return this.searchPerfumeUseCase.searchById(id);

    return { message: 'Debes proporcionar al menos un criterio de búsqueda.' };
  }

  @Post('populate')
  async populate(@Body('name') name: string) {
    return this.populatePerfumeUseCase.execute(name);
  }
}
