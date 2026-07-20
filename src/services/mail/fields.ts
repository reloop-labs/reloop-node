import { ReloopValidationError } from "@/services/mail/errors";

export function requireMailString(value: unknown, field: string): string {
	if (typeof value !== "string" || value.trim().length === 0) {
		throw new ReloopValidationError(
			`${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return value.trim();
}

export function requireRecipient(
	value: unknown,
	field = "to",
): string | string[] {
	if (typeof value === "string") {
		return requireMailString(value, field);
	}
	if (Array.isArray(value)) {
		if (value.length === 0) {
			throw new ReloopValidationError(
				`${field} must contain at least one address.`,
				field,
			);
		}
		return value.map((entry, index) =>
			requireMailString(entry, `${field}[${index}]`),
		);
	}
	throw new ReloopValidationError(
		`${field} is required and must be a string or string array.`,
		field,
	);
}
