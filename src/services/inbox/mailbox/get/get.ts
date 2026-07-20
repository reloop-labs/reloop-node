import type { ReloopClient } from "@/client";
import { requireMailboxId } from "@/services/inbox/mailbox/fields";
import { mailboxById } from "@/services/inbox/mailbox/paths";
import {
	toMailboxResult,
	type MailboxResult,
} from "@/services/inbox/mailbox/result";
import type { MailboxDetail } from "@/services/inbox/mailbox/types";

export async function getMailbox(
	client: ReloopClient,
	id: string,
): Promise<MailboxResult<MailboxDetail>> {
	const mailboxId = requireMailboxId(id);
	const result = await client.fetch<MailboxDetail>(mailboxById(mailboxId), {
		method: "GET",
	});
	return toMailboxResult(result);
}
