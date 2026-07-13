export interface ReloopClientOptions {
	/** Reloop API key (required). Sent as the `x-api-key` header. */
	apiKey: string;
	/** API base URL. Defaults to `https://reloop.sh`. */
	baseUrl?: string;
}
