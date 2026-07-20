import type { ReloopClient } from "@/client";
import { batchMessages } from "@/services/inbox/message/batch/batch";
import { cancelPendingMessage } from "@/services/inbox/message/cancel-pending/cancel-pending";
import { deleteMessage } from "@/services/inbox/message/delete/delete";
import { forwardMessage } from "@/services/inbox/message/forward/forward";
import { getMessage } from "@/services/inbox/message/get/get";
import { getMessageAttachment } from "@/services/inbox/message/get-attachment/get-attachment";
import { getRawMessage } from "@/services/inbox/message/get-raw/get-raw";
import { listMessages } from "@/services/inbox/message/list/list";
import { listSentMessages } from "@/services/inbox/message/list-sent/list-sent";
import { replyToMessage } from "@/services/inbox/message/reply/reply";
import { replyAllToMessage } from "@/services/inbox/message/reply-all/reply-all";
import type {
	MessageListResult,
	MessageResult,
} from "@/services/inbox/message/result";
import { sendMessage } from "@/services/inbox/message/send/send";
import { setMessageRead } from "@/services/inbox/message/set-read/set-read";
import { setMessageStar } from "@/services/inbox/message/set-star/set-star";
import type {
	BatchMessagesParams,
	ComposeMessageParams,
	ForwardMessageParams,
	InboxSuccessResponse,
	ListMessagesParams,
	ListSentMessagesParams,
	Message,
	MessageRaw,
	SendEmailOrPendingResponse,
	SendEmailResponse,
	SendMessageParams,
	SetMessageReadParams,
	SetMessageStarParams,
	UpdateMessageParams,
} from "@/services/inbox/message/types";
import { updateMessage } from "@/services/inbox/message/update/update";
import type { MessageAttachment } from "@/services/inbox/types";

export class MessageService {
	constructor(private readonly client: ReloopClient) {}

	async list(params?: ListMessagesParams): Promise<MessageListResult> {
		return listMessages(this.client, params);
	}

	async listSent(params?: ListSentMessagesParams): Promise<MessageListResult> {
		return listSentMessages(this.client, params);
	}

	async get(id: string): Promise<MessageResult<Message>> {
		return getMessage(this.client, id);
	}

	async batch(params: BatchMessagesParams): Promise<MessageListResult> {
		return batchMessages(this.client, params);
	}

	async getRaw(id: string): Promise<MessageResult<MessageRaw>> {
		return getRawMessage(this.client, id);
	}

	async getAttachment(
		id: string,
		attachmentId: string,
	): Promise<MessageResult<MessageAttachment>> {
		return getMessageAttachment(this.client, id, attachmentId);
	}

	async update(
		id: string,
		params: UpdateMessageParams,
	): Promise<MessageResult<InboxSuccessResponse>> {
		return updateMessage(this.client, id, params);
	}

	async setRead(
		id: string,
		params: SetMessageReadParams,
	): Promise<MessageResult<InboxSuccessResponse>> {
		return setMessageRead(this.client, id, params);
	}

	async setStar(
		id: string,
		params: SetMessageStarParams,
	): Promise<MessageResult<InboxSuccessResponse>> {
		return setMessageStar(this.client, id, params);
	}

	async delete(id: string): Promise<MessageResult<InboxSuccessResponse>> {
		return deleteMessage(this.client, id);
	}

	async send(
		params: SendMessageParams,
	): Promise<MessageResult<SendEmailOrPendingResponse>> {
		return sendMessage(this.client, params);
	}

	async cancelPending(
		id: string,
	): Promise<MessageResult<InboxSuccessResponse>> {
		return cancelPendingMessage(this.client, id);
	}

	async reply(
		id: string,
		params: ComposeMessageParams,
	): Promise<MessageResult<SendEmailResponse>> {
		return replyToMessage(this.client, id, params);
	}

	async replyAll(
		id: string,
		params: ComposeMessageParams,
	): Promise<MessageResult<SendEmailResponse>> {
		return replyAllToMessage(this.client, id, params);
	}

	async forward(
		id: string,
		params: ForwardMessageParams,
	): Promise<MessageResult<SendEmailResponse>> {
		return forwardMessage(this.client, id, params);
	}
}
