import { ReloopClient } from "./client";
import type { ReloopClientOptions } from "./core/types";
import { ApiKeyService } from "./services/api-key/api-key";

export class Reloop {
	public apiKeys: ApiKeyService;
	private client: ReloopClient;

	constructor(options: ReloopClientOptions) {
		this.client = new ReloopClient(options);
		this.apiKeys = new ApiKeyService(this.client);
	}
}

export * from "./client";
export * from "./core/types";
export * from "./services/api-key/api-key";
export * from "./services/api-key/types";
