import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/webhook/errors";
import { requireLimit, requirePage } from "@/services/webhook/fields";
import { webhookListPath } from "@/services/webhook/paths";
import {
	toWebhookListResult,
	type WebhookListResult,
} from "@/services/webhook/result";
import type {
	ListWebhooksParams,
	WebhookListResponse,
	WebhookStatus,
} from "@/services/webhook/types";

const WEBHOOK_STATUSES = new Set<WebhookStatus>([
	"active",
	"paused",
	"disabled",
	"failed",
]);

function validateListParams(
	params?: ListWebhooksParams | null,
): ListWebhooksParams | undefined {
	if (params === undefined || params === null) {
		return undefined;
	}
	if (typeof params !== "object") {
		throw new ReloopValidationError(
			"list params must be an object when provided.",
			"params",
		);
	}

	const out: ListWebhooksParams = {};
	if (params.page !== undefined) out.page = requirePage(params.page);
	if (params.limit !== undefined) out.limit = requireLimit(params.limit);
	if (params.status !== undefined) {
		if (
			typeof params.status !== "string" ||
			!WEBHOOK_STATUSES.has(params.status as WebhookStatus)
		) {
			throw new ReloopValidationError(
				"list status must be a valid webhook status.",
				"status",
			);
		}
		out.status = params.status as WebhookStatus;
	}
	if (params.organizationId !== undefined) {
		if (
			typeof params.organizationId !== "string" ||
			params.organizationId.trim().length === 0
		) {
			throw new ReloopValidationError(
				"list organizationId must be a non-empty string when provided.",
				"organizationId",
			);
		}
		out.organizationId = params.organizationId.trim();
	}
	if (params.userId !== undefined) {
		if (typeof params.userId !== "string" || params.userId.trim().length === 0) {
			throw new ReloopValidationError(
				"list userId must be a non-empty string when provided.",
				"userId",
			);
		}
		out.userId = params.userId.trim();
	}
	return out;
}

export async function listWebhooks(
	client: ReloopClient,
	params?: ListWebhooksParams,
): Promise<WebhookListResult> {
	const valid = validateListParams(params);
	const searchParams = new URLSearchParams();
	if (valid?.page !== undefined) searchParams.set("page", valid.page.toString());
	if (valid?.limit !== undefined) searchParams.set("limit", valid.limit.toString());
	if (valid?.status) searchParams.set("status", valid.status);
	if (valid?.organizationId) {
		searchParams.set("organizationId", valid.organizationId);
	}
	if (valid?.userId) searchParams.set("userId", valid.userId);

	const result = await client.fetch<WebhookListResponse>(
		webhookListPath(searchParams.toString()),
		{ method: "GET" },
	);
	return toWebhookListResult(result);
}
