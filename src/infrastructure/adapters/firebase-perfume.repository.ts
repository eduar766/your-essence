import { Injectable } from '@nestjs/common';
import { Perfume } from '../../domain/entities/perfume.entity';
import { firestore } from '../config/firebase.config';
import * as fuzzysort from 'fuzzysort';
import { PerfumeRepository } from 'src/domain/port/perfume.repository';

@Injectable()
export class FirebasePerfumeRepository extends PerfumeRepository {
  private collection = firestore.collection('perfumes');

  async searchByName(name: string): Promise<Perfume[]> {
    const snapshot = await this.collection.get();
    if (snapshot.empty) return [];

    const perfumes = snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Perfume(
        doc.id,
        data.name,
        data.brand,
        data.description,
        data.notes,
        data.season,
        data.occasion,
        data.year,
      );
    });

    // Aplicamos fuzzy search en memoria
    const results = fuzzysort.go(name, perfumes, { key: 'name' });
    return results.map((result) => result.obj);
  }

  async searchByBrand(brand: string): Promise<Perfume[]> {
    const snapshot = await this.collection.where('brand', '==', brand).get();
    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Perfume(
        doc.id,
        data.name,
        data.brand,
        data.description,
        data.notes,
        data.season,
        data.occasion,
        data.year,
      );
    });
  }

  async searchBySeason(season: string): Promise<Perfume[]> {
    const snapshot = await this.collection
      .where('season', 'array-contains', season)
      .get();
    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Perfume(
        doc.id,
        data.name,
        data.brand,
        data.description,
        data.notes,
        data.season,
        data.occasion,
        data.year,
      );
    });
  }

  async save(perfume: Perfume): Promise<void> {
    if (!perfume.id || !perfume.name || !perfume.brand) {
      throw new Error('El perfume no tiene datos válidos para ser guardado.');
    }

    await this.collection.doc(perfume.id).set({
      name: perfume.name,
      brand: perfume.brand,
      description: perfume.description || 'Descripción no disponible',
      notes: perfume.notes || [],
      season: perfume.season || [],
      occasion: perfume.occasion || [],
      year: perfume.year || 0,
    });
  }
}
