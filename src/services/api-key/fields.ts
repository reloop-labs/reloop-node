import { ReloopValidationError } from "@/services/api-key/errors";

const NAME_MIN = 1;
const NAME_MAX = 255;

export function requireApiKeyId(id: unknown, field = "id"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`API key ${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return id.trim();
}

export function requireApiKeyName(name: unknown, field = "name"): string {
	if (typeof name !== "string") {
		throw new ReloopValidationError(
			`API key ${field} is required and must be a string.`,
			field,
		);
	}
	const trimmed = name.trim();
	if (trimmed.length < NAME_MIN) {
		throw new ReloopValidationError(
			`API key ${field} must be at least ${NAME_MIN} character.`,
			field,
		);
	}
	if (trimmed.length > NAME_MAX) {
		throw new ReloopValidationError(
			`API key ${field} must be at most ${NAME_MAX} characters.`,
			field,
		);
	}
	return trimmed;
}
