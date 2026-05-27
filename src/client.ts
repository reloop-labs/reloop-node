import type { ReloopClientOptions } from "./core/types";

export class ReloopClient {
	public readonly apiKey: string;
	public readonly baseUrl: string;

	constructor(options: ReloopClientOptions) {
		const apiKey = options.apiKey || options.key;
		if (!apiKey) {
			throw new Error("Reloop SDK requires an apiKey.");
		}
		this.apiKey = apiKey;
		this.baseUrl = options.baseUrl || options.url || "https://reloop.sh";
	}

	async fetch<T>(path: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseUrl}${path}`;

		const headers = new Headers(options.headers);
		headers.set("x-api-key", this.apiKey);
		headers.set("Content-Type", "application/json");

		const response = await fetch(url, {
			...options,
			headers,
		});

		if (!response.ok) {
			let errorBody = {};
			try {
				errorBody = await response.json();
			} catch (e) {}
			throw new Error(
				`Reloop API Error: ${response.status} ${response.statusText}`,
				{
					cause: errorBody,
				},
			);
		}

		if (response.status === 204) {
			return {} as T;
		}

		return response.json() as Promise<T>;
	}
}
