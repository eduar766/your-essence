export abstract class AbstractApiKeyRepository {
  abstract findByEmail(email: string): Promise<string | null>;
  abstract save(email: string, apiKey: string): Promise<void>;
}
