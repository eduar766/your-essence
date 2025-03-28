export class ApiKey {
  constructor(
    public readonly email: string,
    public readonly key: string,
    public readonly createdAt: Date,
  ) {}

  static create(email: string): ApiKey {
    const generatedKey = `essence-${Math.random().toString(36).substr(2, 10)}`;
    return new ApiKey(email, generatedKey, new Date());
  }
}
