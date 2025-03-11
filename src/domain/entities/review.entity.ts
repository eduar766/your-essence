export class Review {
  constructor(
    public readonly id: string,
    public readonly perfumeId: string,
    public readonly email: string,
    public readonly rating: number,
    public readonly comment: string,
    public readonly createdAt: Date,
  ) {}
}
