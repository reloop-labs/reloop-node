import { ReloopValidationError } from "@/services/inbox/message/errors";
import type { AttachmentInput } from "@/services/inbox/message/types";

const LIMIT_MIN = 1;
const LIMIT_MAX = 200;
const OFFSET_MIN = 0;
const BATCH_IDS_MAX = 100;

export function requireMessageId(id: unknown, field = "id"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`Message ${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return id.trim();
}

export function requireAttachmentId(id: unknown, field = "attachmentId"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return id.trim();
}

export function requireNonEmptyString(
	value: unknown,
	field: string,
): string {
	if (typeof value !== "string" || value.trim().length === 0) {
		throw new ReloopValidationError(
			`${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return value.trim();
}

export function requireLimit(limit: unknown, field = "limit"): number {
	if (
		typeof limit !== "number" ||
		!Number.isInteger(limit) ||
		limit < LIMIT_MIN ||
		limit > LIMIT_MAX
	) {
		throw new ReloopValidationError(
			`list ${field} must be an integer between ${LIMIT_MIN} and ${LIMIT_MAX}.`,
			field,
		);
	}
	return limit;
}

export function requireOffset(offset: unknown, field = "offset"): number {
	if (
		typeof offset !== "number" ||
		!Number.isInteger(offset) ||
		offset < OFFSET_MIN
	) {
		throw new ReloopValidationError(
			`list ${field} must be an integer >= ${OFFSET_MIN}.`,
			field,
		);
	}
	return offset;
}

export function optionalBoolean(
	value: unknown,
	field: string,
): boolean | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== "boolean") {
		throw new ReloopValidationError(
			`${field} must be a boolean when provided.`,
			field,
		);
	}
	return value;
}

export function requireBoolean(value: unknown, field: string): boolean {
	if (typeof value !== "boolean") {
		throw new ReloopValidationError(
			`${field} is required and must be a boolean.`,
			field,
		);
	}
	return value;
}

export function requireRecipients(
	value: unknown,
	field: string,
): string | string[] {
	if (typeof value === "string") {
		if (value.trim().length === 0) {
			throw new ReloopValidationError(
				`${field} is required and must be a non-empty string.`,
				field,
			);
		}
		return value.trim();
	}
	if (Array.isArray(value)) {
		if (value.length === 0) {
			throw new ReloopValidationError(
				`${field} must be a non-empty array when provided as an array.`,
				field,
			);
		}
		return value.map((entry, index) => {
			if (typeof entry !== "string" || entry.trim().length === 0) {
				throw new ReloopValidationError(
					`${field}[${index}] must be a non-empty string.`,
					field,
				);
			}
			return entry.trim();
		});
	}
	throw new ReloopValidationError(
		`${field} is required and must be a string or array of strings.`,
		field,
	);
}

export function optionalRecipients(
	value: unknown,
	field: string,
): string | string[] | undefined {
	if (value === undefined) return undefined;
	return requireRecipients(value, field);
}

export function optionalString(
	value: unknown,
	field: string,
): string | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== "string") {
		throw new ReloopValidationError(
			`${field} must be a string when provided.`,
			field,
		);
	}
	return value;
}

export function optionalNumber(
	value: unknown,
	field: string,
): number | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== "number" || !Number.isFinite(value)) {
		throw new ReloopValidationError(
			`${field} must be a number when provided.`,
			field,
		);
	}
	return value;
}

export function optionalAttachments(
	attachments: unknown,
): AttachmentInput[] | undefined {
	if (attachments === undefined) return undefined;
	if (!Array.isArray(attachments)) {
		throw new ReloopValidationError(
			"attachments must be an array when provided.",
			"attachments",
		);
	}
	return attachments as AttachmentInput[];
}

export function requireIdArray(
	ids: unknown,
	field = "ids",
	max = BATCH_IDS_MAX,
): string[] {
	if (!Array.isArray(ids) || ids.length === 0) {
		throw new ReloopValidationError(
			`${field} is required and must be a non-empty array.`,
			field,
		);
	}
	if (ids.length > max) {
		throw new ReloopValidationError(
			`${field} must contain at most ${max} items.`,
			field,
		);
	}
	return ids.map((id, index) => {
		if (typeof id !== "string" || id.trim().length === 0) {
			throw new ReloopValidationError(
				`${field}[${index}] must be a non-empty string.`,
				field,
			);
		}
		return id.trim();
	});
}

export function requireComposeBody(params: {
	text?: unknown;
	html?: unknown;
}): { text?: string; html?: string } {
	const text = optionalString(params.text, "text");
	const html = optionalString(params.html, "html");
	if (text === undefined && html === undefined) {
		throw new ReloopValidationError(
			"at least one of text or html is required.",
			"params",
		);
	}
	const body: { text?: string; html?: string } = {};
	if (text !== undefined) body.text = text;
	if (html !== undefined) body.html = html;
	return body;
}

export function buildComposeBody(params: {
	text?: unknown;
	html?: unknown;
	cc?: unknown;
	bcc?: unknown;
	attachments?: unknown;
}): Record<string, unknown> {
	const body: Record<string, unknown> = {
		...requireComposeBody(params),
	};
	const cc = optionalRecipients(params.cc, "cc");
	if (cc !== undefined) body.cc = cc;
	const bcc = optionalRecipients(params.bcc, "bcc");
	if (bcc !== undefined) body.bcc = bcc;
	const attachments = optionalAttachments(params.attachments);
	if (attachments !== undefined) body.attachments = attachments;
	return body;
}
