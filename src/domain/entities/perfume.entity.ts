export class Perfume {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly brand: string,
    public readonly description: string,
    public readonly notes: string[],
    public readonly season: string[], // Ej: ["verano", "invierno"]
    public readonly occasion: string[], // Ej: ["casual", "formal"]
    public readonly year: number,
  ) {}
}
