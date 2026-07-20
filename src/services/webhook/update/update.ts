import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/webhook/errors";
import { requireWebhookId } from "@/services/webhook/fields";
import { webhookById } from "@/services/webhook/paths";
import {
	toWebhookResult,
	type WebhookResult,
} from "@/services/webhook/result";
import type {
	UpdateWebhookParams,
	Webhook,
	WebhookStatus,
} from "@/services/webhook/types";

const WEBHOOK_STATUSES = new Set<WebhookStatus>([
	"active",
	"paused",
	"disabled",
	"failed",
]);

function validateUpdateParams(
	params: UpdateWebhookParams | null | undefined,
): UpdateWebhookParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"update params are required and must be an object.",
			"params",
		);
	}

	const body: UpdateWebhookParams = {};

	if (params.description !== undefined) {
		if (typeof params.description !== "string") {
			throw new ReloopValidationError(
				"update description must be a string when provided.",
				"description",
			);
		}
		body.description = params.description;
	}
	if (params.name !== undefined) {
		if (typeof params.name !== "string") {
			throw new ReloopValidationError(
				"update name must be a string when provided.",
				"name",
			);
		}
		body.name = params.name;
	}
	if (params.url !== undefined) {
		if (typeof params.url !== "string") {
			throw new ReloopValidationError(
				"update url must be a string when provided.",
				"url",
			);
		}
		body.url = params.url;
	}
	if (params.secret !== undefined) {
		if (typeof params.secret !== "string") {
			throw new ReloopValidationError(
				"update secret must be a string when provided.",
				"secret",
			);
		}
		body.secret = params.secret;
	}
	if (params.status !== undefined) {
		if (
			typeof params.status !== "string" ||
			!WEBHOOK_STATUSES.has(params.status as WebhookStatus)
		) {
			throw new ReloopValidationError(
				"update status must be a valid webhook status.",
				"status",
			);
		}
		body.status = params.status as WebhookStatus;
	}
	if (params.customHeaders !== undefined) {
		if (
			typeof params.customHeaders !== "object" ||
			params.customHeaders === null ||
			Array.isArray(params.customHeaders)
		) {
			throw new ReloopValidationError(
				"update customHeaders must be an object when provided.",
				"customHeaders",
			);
		}
		body.customHeaders = params.customHeaders;
	}
	if (params.rateLimitEnabled !== undefined) {
		if (typeof params.rateLimitEnabled !== "boolean") {
			throw new ReloopValidationError(
				"update rateLimitEnabled must be a boolean when provided.",
				"rateLimitEnabled",
			);
		}
		body.rateLimitEnabled = params.rateLimitEnabled;
	}
	if (params.maxRequestsPerMinute !== undefined) {
		if (
			typeof params.maxRequestsPerMinute !== "number" ||
			!Number.isFinite(params.maxRequestsPerMinute)
		) {
			throw new ReloopValidationError(
				"update maxRequestsPerMinute must be a number when provided.",
				"maxRequestsPerMinute",
			);
		}
		body.maxRequestsPerMinute = params.maxRequestsPerMinute;
	}
	if (params.maxRetries !== undefined) {
		if (
			typeof params.maxRetries !== "number" ||
			!Number.isFinite(params.maxRetries)
		) {
			throw new ReloopValidationError(
				"update maxRetries must be a number when provided.",
				"maxRetries",
			);
		}
		body.maxRetries = params.maxRetries;
	}
	if (params.retryBackoffMultiplier !== undefined) {
		if (
			typeof params.retryBackoffMultiplier !== "number" ||
			!Number.isFinite(params.retryBackoffMultiplier)
		) {
			throw new ReloopValidationError(
				"update retryBackoffMultiplier must be a number when provided.",
				"retryBackoffMultiplier",
			);
		}
		body.retryBackoffMultiplier = params.retryBackoffMultiplier;
	}
	if (params.filteringOptions !== undefined) {
		if (
			typeof params.filteringOptions !== "object" ||
			params.filteringOptions === null ||
			Array.isArray(params.filteringOptions)
		) {
			throw new ReloopValidationError(
				"update filteringOptions must be an object when provided.",
				"filteringOptions",
			);
		}
		body.filteringOptions = params.filteringOptions;
	}

	if (Object.keys(body).length === 0) {
		throw new ReloopValidationError(
			"update requires at least one field to change.",
			"params",
		);
	}

	return body;
}

export async function updateWebhook(
	client: ReloopClient,
	webhookId: string,
	params: UpdateWebhookParams,
): Promise<WebhookResult<Webhook>> {
	const id = requireWebhookId(webhookId);
	const body = validateUpdateParams(params);
	const result = await client.fetch<Webhook>(webhookById(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return toWebhookResult(result);
}
