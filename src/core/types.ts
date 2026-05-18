export interface ReloopClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
