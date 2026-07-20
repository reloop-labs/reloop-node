import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/inbox/message/errors";
import { messageListSentPath } from "@/services/inbox/message/paths";
import {
	toMessageListResult,
	type MessageListResult,
} from "@/services/inbox/message/result";
import type { ListSentMessagesParams, Message } from "@/services/inbox/message/types";

function validateListSentParams(
	params?: ListSentMessagesParams | null,
): ListSentMessagesParams | undefined {
	if (params === undefined || params === null) return undefined;
	if (typeof params !== "object") {
		throw new ReloopValidationError(
			"listSent params must be an object when provided.",
			"params",
		);
	}
	if (params.mailboxId !== undefined) {
		if (typeof params.mailboxId !== "string") {
			throw new ReloopValidationError(
				"listSent mailboxId must be a string when provided.",
				"mailboxId",
			);
		}
		return { mailboxId: params.mailboxId };
	}
	return undefined;
}

export async function listSentMessages(
	client: ReloopClient,
	params?: ListSentMessagesParams,
): Promise<MessageListResult> {
	const valid = validateListSentParams(params);
	const searchParams = new URLSearchParams();
	if (valid?.mailboxId) searchParams.set("mailboxId", valid.mailboxId);

	const result = await client.fetch<Message[]>(
		messageListSentPath(searchParams.toString()),
		{ method: "GET" },
	);
	return toMessageListResult(result);
}
