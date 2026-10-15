import { ReloopValidationError } from "@/services/automation/errors";
import type {
	AutomationConnection,
	AutomationStep,
} from "@/services/automation/types";

const NAME_MAX = 255;
const DESCRIPTION_MAX = 2000;
const STEP_TYPES = new Set(["trigger", "send_email", "delay", "condition"]);
const CONNECTION_TYPES = new Set([
	"default",
	"condition_met",
	"condition_not_met",
]);

/*
 * Light checks so obvious mistakes fail before a request. The API checks the
 * flow itself (configs, branches, loops) and reports every problem at once.
 */

export function requireAutomationId(id: unknown, field = "id"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`Automation ${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return id.trim();
}

export function requireName(name: unknown, field = "name"): string {
	if (typeof name !== "string" || name.trim().length === 0) {
		throw new ReloopValidationError(
			`Automation ${field} is required and must be a non-empty string.`,
			field,
		);
	}
	if (name.trim().length > NAME_MAX) {
		throw new ReloopValidationError(
			`Automation ${field} must be at most ${NAME_MAX} characters.`,
			field,
		);
	}
	return name.trim();
}

export function optionalDescription(
	value: unknown,
	field = "description",
): string | null | undefined {
	if (value === undefined || value === null) return value;
	if (typeof value !== "string" || value.length > DESCRIPTION_MAX) {
		throw new ReloopValidationError(
			`${field} must be a string of at most ${DESCRIPTION_MAX} characters.`,
			field,
		);
	}
	return value;
}

export function optionalStatus<T extends string>(
	value: unknown,
	allowed: readonly T[],
	field = "status",
): T | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== "string" || !allowed.includes(value as T)) {
		throw new ReloopValidationError(
			`${field} must be one of ${allowed.map((s) => `"${s}"`).join(", ")}.`,
			field,
		);
	}
	return value as T;
}

export function requireSteps(value: unknown, field = "steps"): AutomationStep[] {
	if (!Array.isArray(value)) {
		throw new ReloopValidationError(`${field} must be an array.`, field);
	}
	value.forEach((step, i) => {
		const at = `${field}[${i}]`;
		if (typeof step !== "object" || step === null) {
			throw new ReloopValidationError(`${at} must be an object.`, at);
		}
		const { key, type, config } = step as Record<string, unknown>;
		if (typeof key !== "string" || key.trim().length === 0) {
			throw new ReloopValidationError(`${at}.key must be a non-empty string.`, `${at}.key`);
		}
		if (typeof type !== "string" || !STEP_TYPES.has(type)) {
			throw new ReloopValidationError(
				`${at}.type must be "trigger", "send_email", "delay" or "condition".`,
				`${at}.type`,
			);
		}
		if (typeof config !== "object" || config === null || Array.isArray(config)) {
			throw new ReloopValidationError(`${at}.config must be an object.`, `${at}.config`);
		}
	});
	return value as AutomationStep[];
}

export function requireConnections(
	value: unknown,
	field = "connections",
): AutomationConnection[] {
	if (!Array.isArray(value)) {
		throw new ReloopValidationError(`${field} must be an array.`, field);
	}
	value.forEach((connection, i) => {
		const at = `${field}[${i}]`;
		if (typeof connection !== "object" || connection === null) {
			throw new ReloopValidationError(`${at} must be an object.`, at);
		}
		const { from, to, type } = connection as Record<string, unknown>;
		if (typeof from !== "string" || typeof to !== "string") {
			throw new ReloopValidationError(`${at}.from and ${at}.to must be step keys.`, at);
		}
		if (type !== undefined && (typeof type !== "string" || !CONNECTION_TYPES.has(type))) {
			throw new ReloopValidationError(
				`${at}.type must be "default", "condition_met" or "condition_not_met".`,
				`${at}.type`,
			);
		}
	});
	return value as AutomationConnection[];
}

export function requirePage(page: unknown, field = "page"): number {
	if (typeof page !== "number" || !Number.isInteger(page) || page < 1) {
		throw new ReloopValidationError(`list ${field} must be an integer >= 1.`, field);
	}
	return page;
}

export function requireLimit(limit: unknown, field = "limit"): number {
	if (typeof limit !== "number" || !Number.isInteger(limit) || limit < 1 || limit > 100) {
		throw new ReloopValidationError(
			`list ${field} must be an integer between 1 and 100.`,
			field,
		);
	}
	return limit;
}

export function requireParamsObject<T>(params: T | null | undefined, name: string): T {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			`${name} params are required and must be an object.`,
			"params",
		);
	}
	return params;
}

const ENROLLMENT_STATUSES = ["active", "completed", "cancelled", "failed"] as const;

export function requireEnrollmentId(id: unknown, field = "enrollmentId"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return id.trim();
}

export function optionalEnrollmentStatus(value: unknown, field = "status") {
	return optionalStatus(value, ENROLLMENT_STATUSES, field);
}

function optionalString(value: unknown, field: string, max = 255): string | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== "string" || value.length > max) {
		throw new ReloopValidationError(
			`${field} must be a string of at most ${max} characters.`,
			field,
		);
	}
	return value;
}

/** `contactId` or `email` (with optional names). Shared by enroll and start. */
export function requireContactTarget(input: Record<string, unknown>): {
	contactId?: string;
	email?: string;
	firstName?: string;
	lastName?: string;
} {
	const contactId = optionalString(input.contactId, "contactId");
	const email = optionalString(input.email, "email");
	if (!contactId?.trim() && !email?.trim()) {
		throw new ReloopValidationError(
			"Pass contactId or email to choose the contact.",
			"contactId",
		);
	}
	if (email !== undefined && !email.includes("@")) {
		throw new ReloopValidationError("email must be a valid email address.", "email");
	}
	const target: Record<string, string> = {};
	if (contactId?.trim()) target.contactId = contactId.trim();
	if (email?.trim()) target.email = email.trim();
	const firstName = optionalString(input.firstName, "firstName");
	const lastName = optionalString(input.lastName, "lastName");
	if (firstName !== undefined) target.firstName = firstName;
	if (lastName !== undefined) target.lastName = lastName;
	return target;
}
