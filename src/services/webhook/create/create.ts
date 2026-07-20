import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/webhook/errors";
import { webhookCreatePath } from "@/services/webhook/paths";
import {
	toWebhookResult,
	type WebhookResult,
} from "@/services/webhook/result";
import type { CreateWebhookParams, Webhook } from "@/services/webhook/types";

function validateCreateParams(
	params: CreateWebhookParams | null | undefined,
): CreateWebhookParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"create params are required and must be an object.",
			"params",
		);
	}
	return params;
}

export async function createWebhook(
	client: ReloopClient,
	params: CreateWebhookParams,
): Promise<WebhookResult<Webhook>> {
	const body = validateCreateParams(params);
	const result = await client.fetch<Webhook>(webhookCreatePath(), {
		method: "POST",
		body: JSON.stringify(body),
	});
	return toWebhookResult(result);
}
