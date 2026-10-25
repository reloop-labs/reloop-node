import type { ReloopClientOptions } from "@/core/types";
import {
	err,
	ok,
	ReloopApiError,
	type ReloopApiErrorBody,
	type ReloopResult,
} from "@/core/result";

const DEFAULT_BASE_URL = "https://reloop.sh";
// Keep in sync with package.json "version".
const SDK_VERSION = "2.3.2";
const DEFAULT_USER_AGENT = `reloop-node/${SDK_VERSION}`;

export class ReloopClient {

	readonly #apiKey: string;
	readonly #baseUrl: string;

	constructor(options: ReloopClientOptions) {
		const apiKey =
			typeof options.apiKey === "string" ? options.apiKey.trim() : "";
		if (!apiKey) {
			throw new Error("Reloop SDK requires an apiKey.");
		}
		this.#apiKey = apiKey;
		this.#baseUrl = options.baseUrl || DEFAULT_BASE_URL;
	}

	async fetch<T>(
		path: string,
		options: RequestInit = {},
	): Promise<ReloopResult<T>> {
		const url = `${this.#baseUrl}${path}`;

		const headers = new Headers(options.headers);
		headers.set("x-api-key", this.#apiKey);
		headers.set("Content-Type", "application/json");
		// The API rejects requests without a User-Agent, and runtimes like
		// Cloudflare Workers don't add one to fetch() by default.
		if (!headers.get("User-Agent")?.trim()) {
			headers.set("User-Agent", DEFAULT_USER_AGENT);
		}

		try {
			const response = await fetch(url, {
				...options,
				headers,
			});

			if (!response.ok) {
				let errorBody: ReloopApiErrorBody = {};
				try {
					errorBody = (await response.json()) as ReloopApiErrorBody;
				} catch {

				}
				return err(
					new ReloopApiError(
						response.status,
						response.statusText,
						errorBody,
					),
				);
			}

			if (response.status === 204) {
				return ok({} as T);
			}

			return ok((await response.json()) as T);
		} catch (cause) {
			const message =
				cause instanceof Error ? cause.message : "Network request failed";
			return err(new ReloopApiError(0, "Network Error", { message }));
		}
	}
}

export type { ReloopResult };
