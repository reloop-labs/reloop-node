import { ReloopValidationError } from "@/services/inbox/thread/errors";
import type {
	ThreadBatchAction,
	ThreadFilter,
	ThreadStatus,
} from "@/services/inbox/thread/types";

const LIMIT_MIN = 1;
const LIMIT_MAX = 200;
const OFFSET_MIN = 0;
const BATCH_IDS_MAX = 100;

const THREAD_STATUSES = new Set<ThreadStatus>([
	"active",
	"archived",
	"closed",
	"trash",
]);

const THREAD_FILTERS = new Set<ThreadFilter>([
	"primary",
	"alerts",
	"person",
	"tag",
]);

const BATCH_ACTIONS = new Set<ThreadBatchAction>([
	"archive",
	"trash",
	"restore",
	"star",
	"unstar",
	"read",
	"unread",
	"important",
	"unimportant",
	"spam",
	"unspam",
	"pin",
	"unpin",
]);

export function requireThreadId(id: unknown, field = "id"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`Thread ${field} is required and must be a non-empty string.`,
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

export function optionalThreadStatus(
	status: unknown,
	field = "status",
): ThreadStatus | undefined {
	if (status === undefined) return undefined;
	if (
		typeof status !== "string" ||
		!THREAD_STATUSES.has(status as ThreadStatus)
	) {
		throw new ReloopValidationError(
			`${field} must be "active", "archived", "closed", or "trash".`,
			field,
		);
	}
	return status as ThreadStatus;
}

export function optionalThreadFilter(
	filter: unknown,
	field = "filter",
): ThreadFilter | undefined {
	if (filter === undefined) return undefined;
	if (
		typeof filter !== "string" ||
		!THREAD_FILTERS.has(filter as ThreadFilter)
	) {
		throw new ReloopValidationError(
			`${field} must be "primary", "alerts", "person", or "tag".`,
			field,
		);
	}
	return filter as ThreadFilter;
}

export function requireBatchAction(action: unknown): ThreadBatchAction {
	if (typeof action !== "string" || !BATCH_ACTIONS.has(action as ThreadBatchAction)) {
		throw new ReloopValidationError(
			"batch action must be a valid thread batch action.",
			"action",
		);
	}
	return action as ThreadBatchAction;
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
