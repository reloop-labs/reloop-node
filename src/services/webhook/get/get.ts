import type { ReloopClient } from "@/client";
import { requireWebhookId } from "@/services/webhook/fields";
import { webhookById } from "@/services/webhook/paths";
import {
	toWebhookResult,
	type WebhookResult,
} from "@/services/webhook/result";
import type { Webhook } from "@/services/webhook/types";

export async function getWebhook(
	client: ReloopClient,
	webhookId: string,
): Promise<WebhookResult<Webhook>> {
	const id = requireWebhookId(webhookId);
	const result = await client.fetch<Webhook>(webhookById(id), {
		method: "GET",
	});
	return toWebhookResult(result);
}
