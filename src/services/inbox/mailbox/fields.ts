import { ReloopValidationError } from "@/services/inbox/mailbox/errors";
import type { MailboxStatus } from "@/services/inbox/mailbox/types";

const MAILBOX_STATUSES = new Set<MailboxStatus>(["active", "disabled"]);

export function requireMailboxId(id: unknown, field = "id"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`Mailbox ${field} is required and must be a non-empty string.`,
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

export function optionalMailboxStatus(
	status: unknown,
	field = "status",
): MailboxStatus | undefined {
	if (status === undefined) return undefined;
	if (
		typeof status !== "string" ||
		!MAILBOX_STATUSES.has(status as MailboxStatus)
	) {
		throw new ReloopValidationError(
			`${field} must be "active" or "disabled".`,
			field,
		);
	}
	return status as MailboxStatus;
}
