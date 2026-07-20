import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/webhook/errors";
import { requireLimit, requirePage, requireWebhookId } from "@/services/webhook/fields";
import { webhookDeliveriesPath } from "@/services/webhook/paths";
import {
	toWebhookDeliveryListResult,
	type WebhookDeliveryListResult,
} from "@/services/webhook/result";
import type {
	ListWebhookDeliveriesParams,
	WebhookDeliveryListResponse,
	WebhookDeliveryStatus,
} from "@/services/webhook/types";

const DELIVERY_STATUSES = new Set<WebhookDeliveryStatus | "">([
	"",
	"pending",
	"success",
	"failed",
	"retrying",
]);

function validateListDeliveriesParams(
	params?: ListWebhookDeliveriesParams | null,
): ListWebhookDeliveriesParams | undefined {
	if (params === undefined || params === null) {
		return undefined;
	}
	if (typeof params !== "object") {
		throw new ReloopValidationError(
			"listDeliveries params must be an object when provided.",
			"params",
		);
	}

	const out: ListWebhookDeliveriesParams = {};
	if (params.page !== undefined) out.page = requirePage(params.page);
	if (params.limit !== undefined) out.limit = requireLimit(params.limit);
	if (params.status !== undefined) {
		if (
			typeof params.status !== "string" ||
			!DELIVERY_STATUSES.has(params.status as WebhookDeliveryStatus | "")
		) {
			throw new ReloopValidationError(
				"listDeliveries status must be a valid delivery status.",
				"status",
			);
		}
		out.status = params.status as WebhookDeliveryStatus | "";
	}
	return out;
}

export async function listWebhookDeliveries(
	client: ReloopClient,
	webhookId: string,
	params?: ListWebhookDeliveriesParams,
): Promise<WebhookDeliveryListResult> {
	const id = requireWebhookId(webhookId);
	const valid = validateListDeliveriesParams(params);
	const searchParams = new URLSearchParams();
	if (valid?.page !== undefined) searchParams.set("page", valid.page.toString());
	if (valid?.limit !== undefined) searchParams.set("limit", valid.limit.toString());
	if (valid?.status !== undefined && valid.status !== "") {
		searchParams.set("status", valid.status);
	}

	const result = await client.fetch<WebhookDeliveryListResponse>(
		webhookDeliveriesPath(id, searchParams.toString()),
		{ method: "GET" },
	);
	return toWebhookDeliveryListResult(result);
}
