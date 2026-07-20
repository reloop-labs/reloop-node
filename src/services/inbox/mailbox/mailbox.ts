import type { ReloopClient } from "@/client";
import { createMailbox } from "@/services/inbox/mailbox/create/create";
import { deleteMailbox } from "@/services/inbox/mailbox/delete/delete";
import { getMailbox } from "@/services/inbox/mailbox/get/get";
import { listMailboxes } from "@/services/inbox/mailbox/list/list";
import type {
	MailboxListResult,
	MailboxResult,
} from "@/services/inbox/mailbox/result";
import type {
	CreateMailboxParams,
	CreateMailboxResponse,
	InboxSuccessResponse,
	MailboxDetail,
	UpdateMailboxParams,
} from "@/services/inbox/mailbox/types";
import { updateMailbox } from "@/services/inbox/mailbox/update/update";

export class MailboxService {
	constructor(private readonly client: ReloopClient) {}

	async list(): Promise<MailboxListResult> {
		return listMailboxes(this.client);
	}

	async get(id: string): Promise<MailboxResult<MailboxDetail>> {
		return getMailbox(this.client, id);
	}

	async create(
		params: CreateMailboxParams,
	): Promise<MailboxResult<CreateMailboxResponse>> {
		return createMailbox(this.client, params);
	}

	async update(
		id: string,
		params: UpdateMailboxParams,
	): Promise<MailboxResult<InboxSuccessResponse>> {
		return updateMailbox(this.client, id, params);
	}

	async delete(id: string): Promise<MailboxResult<InboxSuccessResponse>> {
		return deleteMailbox(this.client, id);
	}
}
