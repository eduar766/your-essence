import { Injectable } from '@nestjs/common';
import { Perfume } from '../../domain/entities/perfume.entity';
import { PerfumeRepository } from 'src/domain/port/perfume.repository';

@Injectable()
export class SearchPerfumeUseCase {
  constructor(private readonly perfumeRepository: PerfumeRepository) {}

  async searchByName(name: string): Promise<Perfume[]> {
    return this.perfumeRepository.searchByName(name);
  }

  async searchByBrand(brand: string): Promise<Perfume[]> {
    return this.perfumeRepository.searchByBrand(brand);
  }

  async searchBySeason(season: string): Promise<Perfume[]> {
    return this.perfumeRepository.searchBySeason(season);
  }
}
