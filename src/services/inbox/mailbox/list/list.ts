import type { ReloopClient } from "@/client";
import { mailboxListPath } from "@/services/inbox/mailbox/paths";
import {
	toMailboxListResult,
	type MailboxListResult,
} from "@/services/inbox/mailbox/result";
import type { Mailbox } from "@/services/inbox/mailbox/types";

export async function listMailboxes(
	client: ReloopClient,
): Promise<MailboxListResult> {
	const result = await client.fetch<Mailbox[]>(mailboxListPath(), {
		method: "GET",
	});
	return toMailboxListResult(result);
}
