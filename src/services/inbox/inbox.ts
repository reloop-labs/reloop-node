import type { ReloopClient } from "@/client";
import { MailboxService } from "@/services/inbox/mailbox/mailbox";
import { MessageService } from "@/services/inbox/message/message";
import { ThreadService } from "@/services/inbox/thread/thread";

export class InboxService {
	public readonly mailboxes: MailboxService;
	public readonly messages: MessageService;
	public readonly threads: ThreadService;

	constructor(client: ReloopClient) {
		this.mailboxes = new MailboxService(client);
		this.messages = new MessageService(client);
		this.threads = new ThreadService(client);
	}
}
