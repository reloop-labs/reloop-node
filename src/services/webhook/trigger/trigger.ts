import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/webhook/errors";
import { webhookTriggerPath } from "@/services/webhook/paths";
import {
	toWebhookResult,
	type WebhookResult,
} from "@/services/webhook/result";
import type {
	TriggerWebhookParams,
	TriggerWebhookResponse,
} from "@/services/webhook/types";

function validateTriggerParams(
	params: TriggerWebhookParams | null | undefined,
): TriggerWebhookParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"trigger params are required and must be an object.",
			"params",
		);
	}
	if (typeof params.event !== "string" || params.event.trim().length === 0) {
		throw new ReloopValidationError(
			"trigger event is required and must be a non-empty string.",
			"event",
		);
	}
	if (
		typeof params.payload !== "object" ||
		params.payload === null ||
		Array.isArray(params.payload)
	) {
		throw new ReloopValidationError(
			"trigger payload is required and must be an object.",
			"payload",
		);
	}

	const body: TriggerWebhookParams = {
		event: params.event.trim(),
		payload: params.payload,
	};
	if (params.organizationId !== undefined) {
		if (
			typeof params.organizationId !== "string" ||
			params.organizationId.trim().length === 0
		) {
			throw new ReloopValidationError(
				"trigger organizationId must be a non-empty string when provided.",
				"organizationId",
			);
		}
		body.organizationId = params.organizationId.trim();
	}
	if (params.userId !== undefined) {
		if (typeof params.userId !== "string" || params.userId.trim().length === 0) {
			throw new ReloopValidationError(
				"trigger userId must be a non-empty string when provided.",
				"userId",
			);
		}
		body.userId = params.userId.trim();
	}
	return body;
}

export async function triggerWebhook(
	client: ReloopClient,
	params: TriggerWebhookParams,
): Promise<WebhookResult<TriggerWebhookResponse>> {
	const body = validateTriggerParams(params);
	const result = await client.fetch<TriggerWebhookResponse>(
		webhookTriggerPath(),
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
	return toWebhookResult(result);
}
