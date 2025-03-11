import { Perfume } from '../entities/perfume.entity';

export abstract class PerfumeRepository {
  abstract searchByName(name: string): Promise<Perfume[]>;
  abstract searchByBrand(brand: string): Promise<Perfume[]>;
  abstract searchBySeason(season: string): Promise<Perfume[]>;
  abstract save(perfume: Perfume): Promise<void>;
}
