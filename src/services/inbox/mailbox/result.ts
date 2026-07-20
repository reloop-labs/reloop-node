import type { ReloopApiError, ReloopResult } from "@/core/result";
import type { Mailbox } from "@/services/inbox/mailbox/types";

export type MailboxResult<T> =
	| { mailbox: T; mailboxError: null }
	| { mailbox: null; mailboxError: ReloopApiError };

export type MailboxListResult =
	| { mailboxes: Mailbox[]; mailboxError: null }
	| { mailboxes: null; mailboxError: ReloopApiError };

export function toMailboxResult<T>(result: ReloopResult<T>): MailboxResult<T> {
	if (result.error) {
		return { mailbox: null, mailboxError: result.error };
	}
	return { mailbox: result.response as T, mailboxError: null };
}

export function toMailboxListResult(
	result: ReloopResult<Mailbox[]>,
): MailboxListResult {
	if (result.error) {
		return { mailboxes: null, mailboxError: result.error };
	}
	return { mailboxes: result.response as Mailbox[], mailboxError: null };
}
