export interface ReloopApiErrorBody {
	message?: string;
	why?: string;
	fix?: string;
	link?: string;
	[key: string]: unknown;
}

export class ReloopApiError extends Error {
	readonly status: number;
	readonly statusText: string;
	readonly body: ReloopApiErrorBody;

	constructor(
		status: number,
		statusText: string,
		body: ReloopApiErrorBody = {},
	) {
		super(
			typeof body.message === "string"
				? body.message
				: `Reloop API Error: ${status} ${statusText}`,
		);
		this.name = "ReloopApiError";
		this.status = status;
		this.statusText = statusText;
		this.body = body;
	}
}

export type ReloopResult<T> =
	| { response: T; error: null }
	| { response: null; error: ReloopApiError };

export function ok<T>(response: T): ReloopResult<T> {
	return { response, error: null };
}

export function err<T>(error: ReloopApiError): ReloopResult<T> {
	return { response: null, error };
}
