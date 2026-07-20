import type {
	AttachmentInput,
	InboxSuccessResponse,
	SendEmailOrPendingResponse,
	SendEmailResponse,
} from "@/services/inbox/types";

export interface MessageAttachmentItem {
	id: string;
	inboundEmailId: string;
	filename: string;
	contentType: string;
	size: number;
	storagePath: string;
	contentDisposition: string | null;
	contentId: string | null;
	createdAt: string;
}

export interface Message {
	id: string;
	mailboxId: string;
	organizationId: string;
	fromEmail: string;
	fromName: string | null;
	toEmails: string[];
	ccEmails?: string[] | null;
	bccEmails?: string[] | null;
	replyTo: string | null;
	subject: string | null;
	textBody: string | null;
	htmlBody: string | null;
	snippet: string | null;
	size: number;
	status: string;
	isRead: boolean;
	isStarred: boolean;
	isSpam: boolean;
	spamScore: number | null;
	messageId: string | null;
	threadId: string | null;
	inReplyTo: string | null;
	references?: string[] | null;
	headers?: Record<string, string> | null;
	date: string | null;
	createdAt: string;
	attachments?: MessageAttachmentItem[];
}

export interface MessageRaw {
	id: string;
	messageId: string | null;
	raw: string;
}

export interface ListMessagesParams {
	mailboxId?: string;
	limit?: number;
	offset?: number;
	q?: string;
	isSpam?: boolean;
}

export interface ListSentMessagesParams {
	mailboxId?: string;
}

export interface BatchMessagesParams {
	ids: string[];
}

export interface UpdateMessageParams {
	isRead?: boolean;
	isStarred?: boolean;
	isSpam?: boolean;
}

export interface SetMessageReadParams {
	isRead: boolean;
}

export interface SetMessageStarParams {
	isStarred: boolean;
}

export interface SendMessageParams {
	mailboxId: string;
	to: string | string[];
	subject: string;
	text?: string;
	html?: string;
	cc?: string | string[];
	bcc?: string | string[];
	attachments?: AttachmentInput[];
	scheduledAt?: string;
	undoWindowSeconds?: number;
}

export interface ComposeMessageParams {
	text?: string;
	html?: string;
	cc?: string | string[];
	bcc?: string | string[];
	attachments?: AttachmentInput[];
}

export interface ForwardMessageParams extends ComposeMessageParams {
	to: string | string[];
}

export type {
	AttachmentInput,
	InboxSuccessResponse,
	SendEmailOrPendingResponse,
	SendEmailResponse,
};
