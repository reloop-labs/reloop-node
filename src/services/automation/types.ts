/** `draft` until started; `active` runs it for new events; `paused` stops it. */
export type AutomationStatus = "draft" | "active" | "paused";

export type DelayUnit = "minutes" | "hours" | "days";

export type ConditionOperator =
	| "eq"
	| "neq"
	| "gt"
	| "gte"
	| "lt"
	| "lte"
	| "contains"
	| "starts_with"
	| "ends_with"
	| "exists"
	| "not_exists"
	| "is_empty";

/** A fixed value, or another field to compare against: `{ var: "trigger.order_id" }`. */
export type ConditionValue =
	| string
	| number
	| boolean
	| null
	| { var: string };

/**
 * Checks one field. `field` reads `trigger.*` (a property of the event that
 * started the automation, e.g. `trigger.plan`) or `contact.*` (`contact.email`,
 * `contact.firstName`, `contact.status` or a contact property). Text compares
 * ignore case; `gt` / `gte` / `lt` / `lte` compare numbers.
 */
export interface ConditionRule {
	type: "rule";
	field: string;
	operator: ConditionOperator;
	/** Not needed for `exists`, `not_exists` and `is_empty`. */
	value?: ConditionValue;
}

/** Every rule (`and`) or any rule (`or`) must match. */
export interface ConditionGroup {
	type: "and" | "or";
	rules: ConditionConfig[];
}

export type ConditionConfig = ConditionRule | ConditionGroup;

export interface TriggerStep {
	key: string;
	type: "trigger";
	/** The key of the custom event that starts it; the `trigger.` prefix is optional. */
	config: { eventName: string };
}

export interface SendEmailStep {
	key: string;
	type: "send_email";
	config: {
		template: { id: string };
		/** Overrides the template's From. */
		from?: string;
		/** Overrides the template's subject. */
		subject?: string;
	};
}

export interface DelayStep {
	key: string;
	type: "delay";
	config: { amount: number; unit: DelayUnit };
}

export interface ConditionStep {
	key: string;
	type: "condition";
	config: ConditionConfig;
}

export type AutomationStep =
	| TriggerStep
	| SendEmailStep
	| DelayStep
	| ConditionStep;

/**
 * `default` between steps; a condition has one `condition_met` and one
 * `condition_not_met` connection.
 */
export type ConnectionType = "default" | "condition_met" | "condition_not_met";

export interface AutomationConnection {
	/** Key of the step this connection leaves. */
	from: string;
	/** Key of the step it leads to. */
	to: string;
	/** Defaults to `default`. */
	type?: ConnectionType;
}

export interface Automation {
	id: string;
	organizationId: string;
	name: string;
	description: string | null;
	status: AutomationStatus;
	/** The trigger's event name, once it has one. */
	triggerEvent: string | null;
	steps: AutomationStep[];
	connections: Required<AutomationConnection>[];
	activeVersionId: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CreateAutomationParams {
	name: string;
	description?: string;
	/** `active` validates the steps and starts it right away. Defaults to `draft`. */
	status?: "draft" | "active";
	steps?: AutomationStep[];
	connections?: AutomationConnection[];
}

export interface UpdateAutomationParams {
	name?: string;
	description?: string | null;
	/** Replaces all steps; send `connections` with it. */
	steps?: AutomationStep[];
	connections?: AutomationConnection[];
	/** `active` validates and starts it; `paused` stops it. */
	status?: "active" | "paused";
}

export interface ListAutomationsParams {
	page?: number;
	limit?: number;
}

export interface AutomationListResponse {
	automations: Automation[];
	total: number;
	page: number;
	limit: number;
}

export interface DeleteAutomationResponse {
	success: boolean;
	id: string;
}

/**
 * Pass `contactId`, or `email` to find the contact (it is created if it does
 * not exist yet; `firstName` / `lastName` are used only then).
 */
export interface EnrollContactParams {
	contactId?: string;
	email?: string;
	firstName?: string;
	lastName?: string;
}

/** `active` while it runs; `failed` when a step could not finish. */
export type EnrollmentStatus = "active" | "completed" | "cancelled" | "failed";

export type StepRunStatus =
	| "pending"
	| "running"
	| "completed"
	| "skipped"
	| "failed";

/** One contact's run through an automation. */
export interface Enrollment {
	id: string;
	automationId: string;
	contactId: string;
	contactEmail: string | null;
	contactFirstName: string | null;
	contactLastName: string | null;
	status: EnrollmentStatus;
	/** The step it is on or waiting at; `null` once it has finished. */
	currentNodeId: string | null;
	enrolledAt: string;
	completedAt: string | null;
	cancelledAt: string | null;
}

export interface EnrollContactResponse {
	enrollment: Enrollment;
	/** `true` when `email` did not match a contact and one was created. */
	contactCreated: boolean;
	/** How long until the first step runs, in milliseconds. */
	delayMs: number;
}

export interface ListEnrollmentsParams {
	page?: number;
	limit?: number;
	status?: EnrollmentStatus;
}

export interface EnrollmentListResponse {
	enrollments: Enrollment[];
	total: number;
	page: number;
	limit: number;
}

/** What happened at one step of an enrollment. */
export interface StepRun {
	id: string;
	/** The step's key. */
	nodeId: string;
	nodeType: string;
	status: StepRunStatus;
	scheduledFor: string;
	startedAt: string | null;
	finishedAt: string | null;
	/** The email a `send_email` step sent. */
	emailLogId: string | null;
	error: string | null;
}

export interface EnrollmentDetail {
	enrollment: Enrollment;
	steps: StepRun[];
}

/**
 * Pass `contactId`, or `email` to find the contact (it is created if it does
 * not exist yet; `firstName` / `lastName` are used only then).
 */
export interface StartAutomationParams {
	/** The trigger's key, e.g. `user.signed_up` (same as `trigger.user.signed_up`). */
	event: string;
	contactId?: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	/** Conditions read them as `trigger.<name>`. */
	properties?: Record<string, unknown>;
}

export interface StartAutomationResponse {
	success: boolean;
	eventId: string;
	eventKey: string;
	contactId: string;
	/** `true` when `email` did not match a contact and one was created. */
	contactCreated: boolean;
	/** How many active automations this started. */
	enrollments: number;
	/** The properties after defaults were applied. */
	properties: Record<string, unknown>;
}
