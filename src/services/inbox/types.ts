export interface InboxSuccessResponse {
	success: boolean;
	id?: string;
	message?: string;
	isRead?: boolean;
	isStarred?: boolean;
	isSpam?: boolean;
	isImportant?: boolean;
	isPinned?: boolean;
	status?: string;
	deletedAt?: string | null;
}

export interface SendEmailResponse {
	success: boolean;
	messageId: string;
	status: string;
	timestamp: string;
	id: string;
}

export interface PendingSendResponse {
	success: boolean;
	pending: true;
	id: string;
	sendAt: string;
	messageId: string;
}

export type SendEmailOrPendingResponse =
	| SendEmailResponse
	| PendingSendResponse;

export interface ThreadBatchResponse {
	success: boolean;
	ids: string[];
	action: string;
}

export interface MessageAttachment {
	id: string;
	filename: string;
	contentType: string;
	size: number;
	storagePath: string;
	contentDisposition: string | null;
	contentId: string | null;
	createdAt: string;
}

export interface AttachmentInput {
	content?: string;
	filename?: string;
	path?: string;
	content_type?: string;
	content_id?: string;
}
