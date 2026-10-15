import { ReloopValidationError } from "@/services/automation/errors";
import type { TriggerPropertyParams } from "@/services/automation/trigger/types";

export {
	optionalDescription,
	requireLimit,
	requirePage,
	requireParamsObject,
} from "@/services/automation/fields";

const PROPERTY_NAME = /^[a-zA-Z][a-zA-Z0-9_]*$/;
const PROPERTY_TYPES = new Set(["string", "number", "boolean"]);

export function requireTriggerRef(value: unknown, field = "id"): string {
	if (typeof value !== "string" || value.trim().length === 0) {
		throw new ReloopValidationError(
			`Trigger ${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return value.trim();
}

export function requireTriggerName(value: unknown, field = "name"): string {
	if (typeof value !== "string" || value.trim().length === 0) {
		throw new ReloopValidationError(
			`Trigger ${field} is required and must be a non-empty string.`,
			field,
		);
	}
	if (value.trim().length > 255) {
		throw new ReloopValidationError(
			`Trigger ${field} must be at most 255 characters.`,
			field,
		);
	}
	return value.trim();
}

export function requireProperties(
	value: unknown,
	field = "properties",
): TriggerPropertyParams[] {
	if (!Array.isArray(value) || value.length > 50) {
		throw new ReloopValidationError(
			`${field} must be an array of at most 50 properties.`,
			field,
		);
	}
	value.forEach((property, i) => {
		const at = `${field}[${i}]`;
		if (typeof property !== "object" || property === null) {
			throw new ReloopValidationError(`${at} must be an object.`, at);
		}
		const { name, propertyType } = property as Record<string, unknown>;
		if (typeof name !== "string" || !PROPERTY_NAME.test(name) || name.length > 128) {
			throw new ReloopValidationError(
				`${at}.name must start with a letter and use only letters, digits and _.`,
				`${at}.name`,
			);
		}
		if (
			propertyType !== undefined &&
			(typeof propertyType !== "string" || !PROPERTY_TYPES.has(propertyType))
		) {
			throw new ReloopValidationError(
				`${at}.propertyType must be "string", "number" or "boolean".`,
				`${at}.propertyType`,
			);
		}
	});
	return value as TriggerPropertyParams[];
}
