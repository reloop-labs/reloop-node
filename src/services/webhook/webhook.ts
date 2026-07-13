import type { ReloopClient } from "#src/client";
import type { ReloopResult } from "#src/core/result";
import type {
	CreateWebhookParams,
	DeleteWebhookResponse,
	ListWebhookDeliveriesParams,
	ListWebhooksParams,
	RetryWebhookDeliveryResponse,
	TriggerWebhookParams,
	TriggerWebhookResponse,
	UpdateWebhookParams,
	VerifyWebhookParams,
	Webhook,
	WebhookDeliveryListResponse,
	WebhookEvent,
	WebhookListResponse,
} from "#src/services/webhook/types";
import {
	verifyWebhook,
	WEBHOOK_SIGNATURE_HEADER,
} from "#src/services/webhook/verify";

export class WebhookService {
	constructor(private readonly client: ReloopClient) {}

	static verify(params: VerifyWebhookParams): WebhookEvent {
		return verifyWebhook(params);
	}

	static constructEvent(
		payload: string | Buffer,
		signature: string | null | undefined,
		secret: string,
		tolerance = 300,
	): WebhookEvent {
		return WebhookService.verify({
			payload,
			headers: { [WEBHOOK_SIGNATURE_HEADER]: signature },
			secret,
			tolerance,
		});
	}

	verify(params: VerifyWebhookParams): WebhookEvent {
		return WebhookService.verify(params);
	}

	async create(params: CreateWebhookParams): Promise<ReloopResult<Webhook>> {
		return this.client.fetch<Webhook>("/api/webhook/v1/", {
			method: "POST",
			body: JSON.stringify(params),
		});
	}

	async list(params?: ListWebhooksParams): Promise<ReloopResult<WebhookListResponse>> {
		const searchParams = new URLSearchParams();
		if (params?.page !== undefined) searchParams.set("page", params.page.toString());
		if (params?.limit !== undefined) searchParams.set("limit", params.limit.toString());
		if (params?.status) searchParams.set("status", params.status);
		if (params?.organizationId) searchParams.set("organizationId", params.organizationId);
		if (params?.userId) searchParams.set("userId", params.userId);

		const queryString = searchParams.toString();
		const path = `/api/webhook/v1/${queryString ? `?${queryString}` : ""}`;

		return this.client.fetch<WebhookListResponse>(path, { method: "GET" });
	}

	async get(webhookId: string): Promise<ReloopResult<Webhook>> {
		return this.client.fetch<Webhook>(`/api/webhook/v1/${webhookId}`, {
			method: "GET",
		});
	}

	async update(webhookId: string, params: UpdateWebhookParams): Promise<ReloopResult<Webhook>> {
		return this.client.fetch<Webhook>(`/api/webhook/v1/${webhookId}`, {
			method: "PATCH",
			body: JSON.stringify(params),
		});
	}

	async delete(webhookId: string): Promise<ReloopResult<DeleteWebhookResponse>> {
		return this.client.fetch<DeleteWebhookResponse>(
			`/api/webhook/v1/${webhookId}`,
			{ method: "DELETE" },
		);
	}

	async pause(webhookId: string): Promise<ReloopResult<Webhook>> {
		return this.update(webhookId, { status: "paused" });
	}

	async enable(webhookId: string): Promise<ReloopResult<Webhook>> {
		return this.update(webhookId, { status: "active" });
	}

	async disable(webhookId: string): Promise<ReloopResult<Webhook>> {
		return this.update(webhookId, { status: "disabled" });
	}

	async trigger(params: TriggerWebhookParams): Promise<ReloopResult<TriggerWebhookResponse>> {
		return this.client.fetch<TriggerWebhookResponse>("/api/webhook/v1/trigger", {
			method: "POST",
			body: JSON.stringify(params),
		});
	}

	async listDeliveries(
		webhookId: string,
		params?: ListWebhookDeliveriesParams,
	): Promise<ReloopResult<WebhookDeliveryListResponse>> {
		const searchParams = new URLSearchParams();
		if (params?.page !== undefined) searchParams.set("page", params.page.toString());
		if (params?.limit !== undefined) searchParams.set("limit", params.limit.toString());
		if (params?.status !== undefined) searchParams.set("status", params.status);

		const queryString = searchParams.toString();
		const path = `/api/webhook/v1/${webhookId}/deliveries${
			queryString ? `?${queryString}` : ""
		}`;

		return this.client.fetch<WebhookDeliveryListResponse>(path, {
			method: "GET",
		});
	}

	async retryDelivery(deliveryId: string): Promise<ReloopResult<RetryWebhookDeliveryResponse>> {
		return this.client.fetch<RetryWebhookDeliveryResponse>(
			`/api/webhook/deliveries/${deliveryId}/retry`,
			{ method: "POST" },
		);
	}
}
