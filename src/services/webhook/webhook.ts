import type { ReloopClient } from "@/client";
import { createWebhook } from "@/services/webhook/create/create";
import { deleteWebhook } from "@/services/webhook/delete/delete";
import { getWebhook } from "@/services/webhook/get/get";
import { listWebhookDeliveries } from "@/services/webhook/list-deliveries/list-deliveries";
import { listWebhooks } from "@/services/webhook/list/list";
import type {
	WebhookDeliveryListResult,
	WebhookListResult,
	WebhookResult,
} from "@/services/webhook/result";
import { retryWebhookDelivery } from "@/services/webhook/retry-delivery/retry-delivery";
import { triggerWebhook } from "@/services/webhook/trigger/trigger";
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
	WebhookEvent,
} from "@/services/webhook/types";
import { updateWebhook } from "@/services/webhook/update/update";
import {
	verifyWebhook,
	WEBHOOK_SIGNATURE_HEADER,
} from "@/services/webhook/verify/verify";

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

	async create(params: CreateWebhookParams): Promise<WebhookResult<Webhook>> {
		return createWebhook(this.client, params);
	}

	async list(params?: ListWebhooksParams): Promise<WebhookListResult> {
		return listWebhooks(this.client, params);
	}

	async get(webhookId: string): Promise<WebhookResult<Webhook>> {
		return getWebhook(this.client, webhookId);
	}

	async update(
		webhookId: string,
		params: UpdateWebhookParams,
	): Promise<WebhookResult<Webhook>> {
		return updateWebhook(this.client, webhookId, params);
	}

	async delete(
		webhookId: string,
	): Promise<WebhookResult<DeleteWebhookResponse>> {
		return deleteWebhook(this.client, webhookId);
	}

	async pause(webhookId: string): Promise<WebhookResult<Webhook>> {
		return updateWebhook(this.client, webhookId, { status: "paused" });
	}

	async enable(webhookId: string): Promise<WebhookResult<Webhook>> {
		return updateWebhook(this.client, webhookId, { status: "active" });
	}

	async disable(webhookId: string): Promise<WebhookResult<Webhook>> {
		return updateWebhook(this.client, webhookId, { status: "disabled" });
	}

	async trigger(
		params: TriggerWebhookParams,
	): Promise<WebhookResult<TriggerWebhookResponse>> {
		return triggerWebhook(this.client, params);
	}

	async listDeliveries(
		webhookId: string,
		params?: ListWebhookDeliveriesParams,
	): Promise<WebhookDeliveryListResult> {
		return listWebhookDeliveries(this.client, webhookId, params);
	}

	async retryDelivery(
		deliveryId: string,
	): Promise<WebhookResult<RetryWebhookDeliveryResponse>> {
		return retryWebhookDelivery(this.client, deliveryId);
	}
}
