export interface ApiKey {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  userId: string;
  enabled: boolean;
  lastUsedAt?: string | null;
}

export interface ApiKeyWithKey extends ApiKey {
  key: string;
}
