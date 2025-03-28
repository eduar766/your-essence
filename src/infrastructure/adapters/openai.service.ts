import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getPerfumeData(name: string) {
    const prompt = `
    Genera un JSON con los detalles del perfume "${name}". 
    IMPORTANTE: Solo devuelve el JSON, sin texto adicional antes o después. No uses markdown ni explicaciones.
    
    Formato requerido:
    {
      "name": "Acqua di Gio",
      "brand": "Giorgio Armani",
      "description": "Perfume fresco con notas marinas...",
      "notes": {
        "top": ["Limón", "Naranja", "Bergamota"],
        "middle": ["Jazmín", "Ciclamen", "Nuez Moscada"],
        "base": ["Almizcle", "Ámbar", "Maderas"]
      },
      "season": ["Verano", "Primavera"],
      "occasion": ["Casual", "Diario"],
      "year": 1996
    }
    
    Si falta información, usa "Desconocido" o [].`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      response_format: {"type": "json_object"},
    });

    let result = response.choices[0]?.message?.content;
    if (!result) return null;

    try {
      return JSON.parse(result);
    } catch (error) {
      console.error('Error al parsear JSON de OpenAI:', result);
      throw new Error('La IA devolvió un formato JSON inválido.');
    }
  }
}
