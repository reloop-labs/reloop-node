import type { InboxSuccessResponse, ThreadBatchResponse } from "@/services/inbox/types";

export type ThreadStatus = "active" | "archived" | "closed" | "trash";

export type ThreadFilter = "primary" | "alerts" | "person" | "tag";

export type ThreadBatchAction =
	| "archive"
	| "trash"
	| "restore"
	| "star"
	| "unstar"
	| "read"
	| "unread"
	| "important"
	| "unimportant"
	| "spam"
	| "unspam"
	| "pin"
	| "unpin";

export interface ThreadLabel {
	id: string;
	name: string;
	color: string;
}

export interface Thread {
	id: string;
	mailboxId: string | null;
	organizationId: string;
	subject: string | null;
	lastMessagePreview: string | null;
	lastMessageAt: string;
	status: string;
	messageCount: number;
	participants: string[];
	isRead: boolean;
	isStarred: boolean;
	isImportant?: boolean;
	isPinned?: boolean;
	pinnedAt?: string | null;
	labels?: ThreadLabel[];
	deletedAt?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ThreadMessage {
	id: string;
	threadId: string;
	direction: string;
	inboundEmailId: string | null;
	emailLogId: string | null;
	fromEmail: string;
	fromName: string | null;
	subject: string | null;
	preview: string | null;
	messageAt: string;
	rfc822MessageId: string | null;
	inReplyTo: string | null;
	createdAt: string;
	email: unknown;
}

export interface ThreadDetail extends Thread {
	messages: ThreadMessage[];
}

export interface ListThreadsParams {
	mailboxId?: string;
	limit?: number;
	offset?: number;
	folder?: string;
	q?: string;
	isPinned?: boolean;
	filter?: ThreadFilter;
}

export interface BatchThreadsParams {
	ids: string[];
	action: ThreadBatchAction;
}

export interface UpdateThreadParams {
	isRead?: boolean;
	isStarred?: boolean;
	isImportant?: boolean;
	isPinned?: boolean;
	status?: ThreadStatus;
}

export interface SetThreadReadParams {
	isRead: boolean;
}

export interface SetThreadStarParams {
	isStarred: boolean;
}

export type { InboxSuccessResponse, ThreadBatchResponse };
