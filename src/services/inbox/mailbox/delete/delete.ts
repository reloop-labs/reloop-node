import type { ReloopClient } from "@/client";
import { requireMailboxId } from "@/services/inbox/mailbox/fields";
import { mailboxById } from "@/services/inbox/mailbox/paths";
import {
	toMailboxResult,
	type MailboxResult,
} from "@/services/inbox/mailbox/result";
import type { InboxSuccessResponse } from "@/services/inbox/mailbox/types";

export async function deleteMailbox(
	client: ReloopClient,
	id: string,
): Promise<MailboxResult<InboxSuccessResponse>> {
	const mailboxId = requireMailboxId(id);
	const result = await client.fetch<InboxSuccessResponse>(
		mailboxById(mailboxId),
		{ method: "DELETE" },
	);
	return toMailboxResult(result);
}
