import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SearchPerfumeUseCase } from '../../application/use-cases/search-perfume.use-case';
import { PopulatePerfumeUseCase } from 'src/application/use-cases/populate-perfume.use-case';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Perfumes')
@ApiSecurity('x-api-key')
@Controller('perfumes')
export class PerfumeController {
  constructor(
    private readonly searchPerfumeUseCase: SearchPerfumeUseCase,
    private readonly populatePerfumeUseCase: PopulatePerfumeUseCase,
  ) {}

  @Get('search')
  @ApiOperation({
    summary: 'Buscar perfumes por nombre, marca o estación del año o por id',
  })
  @ApiResponse({ status: 200, description: 'Lista de perfumes encontrados' })
  @ApiQuery({ name: 'Sauvage', required: false, description: 'Nombre del perfume' })
  @ApiQuery({ name: 'Dior', required: false, description: 'Marca del perfume' })
  @ApiQuery({ name: 'Otoño', required: false, description: 'Estación recomendada' })
  @ApiQuery({ name: 'id', required: false, description: 'ID del perfume' })
  async search(
    @Query('Sauvage') name?: string,
    @Query('Dior') brand?: string,
    @Query('Otoño') season?: string,
    @Query('id') id?: string,
  ) {
    if (name) return this.searchPerfumeUseCase.searchByName(name);
    if (brand) return this.searchPerfumeUseCase.searchByBrand(brand);
    if (season) return this.searchPerfumeUseCase.searchBySeason(season);
    if (id) return this.searchPerfumeUseCase.searchById(id);

    return { message: 'Debes proporcionar al menos un criterio de búsqueda.' };
  }

  @Post('populate')
  @ApiOperation({
    summary: 'Busca informacion de un perfume en OpenAI y la almacena en la base de datos',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Dior Sauvage' },
      },
    },
  })
  async populate(@Body('name') name: string) {
    return this.populatePerfumeUseCase.execute(name);
  }
}
