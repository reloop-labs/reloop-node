import type { ReloopClientOptions } from "#src/core/types";
import {
	err,
	ok,
	ReloopApiError,
	type ReloopApiErrorBody,
	type ReloopResult,
} from "#src/core/result";

const DEFAULT_BASE_URL = "https://reloop.sh";

export class ReloopClient {
	/** Credential used for `x-api-key`; not part of the public surface. */
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
					// ignore non-JSON error bodies
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
