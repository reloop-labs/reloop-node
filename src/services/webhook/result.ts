import type { ReloopApiError, ReloopResult } from "@/core/result";
import type {
	WebhookDeliveryListResponse,
	WebhookListResponse,
} from "@/services/webhook/types";

export type WebhookResult<T> =
	| { webhook: T; webhookError: null }
	| { webhook: null; webhookError: ReloopApiError };

export type WebhookListResult =
	| { webhooks: WebhookListResponse; webhookError: null }
	| { webhooks: null; webhookError: ReloopApiError };

export type WebhookDeliveryListResult =
	| { deliveries: WebhookDeliveryListResponse; webhookError: null }
	| { deliveries: null; webhookError: ReloopApiError };

export function toWebhookResult<T>(result: ReloopResult<T>): WebhookResult<T> {
	if (result.error) {
		return { webhook: null, webhookError: result.error };
	}
	return { webhook: result.response as T, webhookError: null };
}

export function toWebhookListResult(
	result: ReloopResult<WebhookListResponse>,
): WebhookListResult {
	if (result.error) {
		return { webhooks: null, webhookError: result.error };
	}
	return {
		webhooks: result.response as WebhookListResponse,
		webhookError: null,
	};
}

export function toWebhookDeliveryListResult(
	result: ReloopResult<WebhookDeliveryListResponse>,
): WebhookDeliveryListResult {
	if (result.error) {
		return { deliveries: null, webhookError: result.error };
	}
	return {
		deliveries: result.response as WebhookDeliveryListResponse,
		webhookError: null,
	};
}
