import type { ReloopClient } from "@/client";
import { requireWebhookId } from "@/services/webhook/fields";
import { webhookById } from "@/services/webhook/paths";
import {
	toWebhookResult,
	type WebhookResult,
} from "@/services/webhook/result";
import type { DeleteWebhookResponse } from "@/services/webhook/types";

export async function deleteWebhook(
	client: ReloopClient,
	webhookId: string,
): Promise<WebhookResult<DeleteWebhookResponse>> {
	const id = requireWebhookId(webhookId);
	const result = await client.fetch<DeleteWebhookResponse>(webhookById(id), {
		method: "DELETE",
	});
	return toWebhookResult(result);
}
