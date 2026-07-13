export type WebhookStatus = "active" | "paused" | "disabled" | "failed";

export type WebhookDeliveryStatus =
	| "pending"
	| "success"
	| "failed"
	| "retrying";

export interface Webhook {
	id: string;
	name: string;
	url: string;
	secret: string;
	status: WebhookStatus;
	customHeaders: Record<string, string> | null;
	rateLimitEnabled: boolean;
	maxRequestsPerMinute: number;
	maxRetries: number;
	retryBackoffMultiplier: number;
	filteringOptions: Record<string, unknown> | null;
	lastTriggeredAt: string | null;
	successCount: number;
	failureCount: number;
	consecutiveFailures: number;
	events: string[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateWebhookParams {
	description: string;
	url: string;
	events: string[];
}

export interface UpdateWebhookParams {
	description?: string;
	name?: string;
	url?: string;
	secret?: string;
	status?: WebhookStatus;
	customHeaders?: Record<string, string>;
	rateLimitEnabled?: boolean;
	maxRequestsPerMinute?: number;
	maxRetries?: number;
	retryBackoffMultiplier?: number;
	filteringOptions?: Record<string, unknown>;
}

export interface ListWebhooksParams {
	page?: number;
	limit?: number;
	status?: WebhookStatus;
	organizationId?: string;
	userId?: string;
}

export interface WebhookListResponse {
	webhooks: Webhook[];
	total: number;
	page: number;
	limit: number;
}

export interface DeleteWebhookResponse {
	id: string;
	message: string;
}

export interface TriggerWebhookParams {
	event: string;
	payload: Record<string, unknown>;
	organizationId?: string;
	userId?: string;
}

export interface TriggerWebhookResponse {
	success: boolean;
	message: string;
	jobId?: string;
}

export interface WebhookDelivery {
	id: string;
	webhookId: string;
	webhookEventId: string | null;
	eventType: string;
	eventData: Record<string, unknown>;
	status: WebhookDeliveryStatus;
	requestUrl: string;
	requestHeaders: Record<string, string> | null;
	requestBody: Record<string, unknown> | null;
	responseStatus: number | null;
	responseBody: string | null;
	responseHeaders: Record<string, string> | null;
	attemptNumber: number;
	maxAttempts: number;
	nextRetryAt: string | null;
	lastAttemptAt: string | null;
	errorMessage: string | null;
	errorDetails: Record<string, unknown> | null;
	completedAt: string | null;
	durationMs: number | null;
	createdAt: string;
}

export interface ListWebhookDeliveriesParams {
	page?: number;
	limit?: number;
	status?: WebhookDeliveryStatus | "";
}

export interface WebhookDeliveryListResponse {
	deliveries: WebhookDelivery[];
	total: number;
	page: number;
	limit: number;
}

export interface RetryWebhookDeliveryResponse {
	success: boolean;
	message: string;
}

export interface WebhookEvent {
	id: string;
	event: string;
	payload: Record<string, unknown>;
	timestamp: number;
}

export interface VerifyWebhookParams {
	payload: string | Buffer;
	headers: Record<string, string | null | undefined>;
	secret: string;

	tolerance?: number;
}

export class WebhookSignatureVerificationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "WebhookSignatureVerificationError";
	}
}
