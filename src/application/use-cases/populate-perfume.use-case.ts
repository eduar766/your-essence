import { Injectable } from '@nestjs/common';
import { Perfume } from '../../domain/entities/perfume.entity';
import { OpenAIService } from '../../infrastructure/adapters/openai.service';
import { v4 as uuidv4 } from 'uuid';
import { PerfumeRepository } from 'src/domain/port/perfume.repository';

// Diccionario de equivalencias para nombres de propiedades
const FIELD_MAP: { [key: string]: string } = {
  nombre: "name",
  name: "name",
  marca: "brand",
  descripción: "description",
  descripcion: "description",
  notas_olfativas: "notes",
  notas_salida: "notes_top",
  salida: "notes_top",
  notas_de_salida: "notes_top",
  notas_de_cabeza: "notes_top",
  notas_de_entrada: "notes_top",
  notas_corazon: "notes_middle",
  corazon: "notes_middle",
  notas_de_corazón: "notes_middle",
  notas_de_medio: "notes_middle",
  notas_medio: "notes_middle",
  notas_fondo: "notes_base",
  notas_de_fondo: "notes_base",
  base: "notes_base",
  estacion_recomendada: "season",
  estación_recomendada: "season",
  ocasion_recomendada: "occasion",
  ocasión_recomendada: "occasion",
  año_lanzamiento: "year",
  ano_lanzamiento: "year",
  año_de_lanzamiento: "year",
  ano_de_lanzamiento: "year",
};

@Injectable()
export class PopulatePerfumeUseCase {
  constructor(
    private readonly perfumeRepository: PerfumeRepository,
    private readonly openAIService: OpenAIService,
  ) {}

  async execute(name: string): Promise<Perfume> {
    // Verificar si el perfume ya existe
    const existingPerfumes = await this.perfumeRepository.searchByName(name);
    if (existingPerfumes.length > 0) {
      return existingPerfumes[0]; // Retornar el primero encontrado
    }

    // Obtener datos desde IA
    let perfumeData = await this.openAIService.getPerfumeData(name);
    if (!perfumeData) {
      throw new Error(
        `No se pudo obtener información para el perfume: ${name}`,
      );
    }
    console.log('antes', perfumeData)

    // Normalizar la respuesta de la IA
    perfumeData = this.normalizePerfumeData(perfumeData);

    console.log('despues de normalizar', perfumeData)

    // Validar que todos los valores existen
    if (
      !perfumeData.name ||
      !perfumeData.brand ||
      !perfumeData.description ||
      !perfumeData.notes ||
      !perfumeData.season ||
      !perfumeData.occasion ||
      !perfumeData.year
    ) {
      throw new Error(
        `Los datos obtenidos de la IA son inválidos o incompletos para el perfume: ${name}`,
      );
    }

    // Generar un ID único para el perfume
    const newPerfume = new Perfume(
      uuidv4(),
      perfumeData.name,
      perfumeData.brand,
      perfumeData.description,
      perfumeData.notes,
      perfumeData.season,
      perfumeData.occasion,
      perfumeData.year,
    );

    // Guardar en la base de datos
    await this.perfumeRepository.save(newPerfume);

    return newPerfume;
  }

  private normalizePerfumeData(data: any): any {
    const normalizedData: any = {};
  
    // Recorrer cada propiedad del objeto recibido y mapearla al formato esperado
    for (const key in data) {
      const normalizedKey = FIELD_MAP[key.toLowerCase()] || key; // Convertir a minúsculas y buscar en el mapa
      normalizedData[normalizedKey] = data[key];
    }
  
    return {
      name: normalizedData.name || "Nombre desconocido",
      brand: normalizedData.brand || "Marca desconocida",
      description: normalizedData.description || "Descripción no disponible",
      notes: {
        top: normalizedData.notes.top || [],
        middle: normalizedData.notes.middle || [],
        base: normalizedData.notes.base || [],
      },
      season: normalizedData.season ? normalizedData.season : [],
      occasion: normalizedData.occasion ? normalizedData.occasion : [],
      year: parseInt(normalizedData.year || "0", 10),
    };
  }
}
