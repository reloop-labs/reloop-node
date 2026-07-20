import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/inbox/message/errors";
import {
	optionalBoolean,
	requireLimit,
	requireOffset,
} from "@/services/inbox/message/fields";
import { messageListPath } from "@/services/inbox/message/paths";
import {
	toMessageListResult,
	type MessageListResult,
} from "@/services/inbox/message/result";
import type { ListMessagesParams, Message } from "@/services/inbox/message/types";

function validateListParams(
	params?: ListMessagesParams | null,
): ListMessagesParams | undefined {
	if (params === undefined || params === null) return undefined;
	if (typeof params !== "object") {
		throw new ReloopValidationError(
			"list params must be an object when provided.",
			"params",
		);
	}

	const out: ListMessagesParams = {};
	if (params.mailboxId !== undefined) {
		if (typeof params.mailboxId !== "string") {
			throw new ReloopValidationError(
				"list mailboxId must be a string when provided.",
				"mailboxId",
			);
		}
		out.mailboxId = params.mailboxId;
	}
	if (params.limit !== undefined) out.limit = requireLimit(params.limit);
	if (params.offset !== undefined) out.offset = requireOffset(params.offset);
	if (params.q !== undefined) {
		if (typeof params.q !== "string") {
			throw new ReloopValidationError(
				"list q must be a string when provided.",
				"q",
			);
		}
		out.q = params.q;
	}
	if (params.isSpam !== undefined) {
		out.isSpam = optionalBoolean(params.isSpam, "isSpam");
	}
	return out;
}

export async function listMessages(
	client: ReloopClient,
	params?: ListMessagesParams,
): Promise<MessageListResult> {
	const valid = validateListParams(params);
	const searchParams = new URLSearchParams();
	if (valid?.mailboxId) searchParams.set("mailboxId", valid.mailboxId);
	if (valid?.limit !== undefined) searchParams.set("limit", valid.limit.toString());
	if (valid?.offset !== undefined) {
		searchParams.set("offset", valid.offset.toString());
	}
	if (valid?.q) searchParams.set("q", valid.q);
	if (valid?.isSpam !== undefined) {
		searchParams.set("isSpam", valid.isSpam.toString());
	}

	const result = await client.fetch<Message[]>(
		messageListPath(searchParams.toString()),
		{ method: "GET" },
	);
	return toMessageListResult(result);
}
