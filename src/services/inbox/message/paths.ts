import { INBOX_V1 } from "@/services/inbox/mailbox/paths";

export const MESSAGES_V1 = `${INBOX_V1}/messages`;

export function messageListPath(queryString: string): string {
	return `${MESSAGES_V1}${queryString ? `?${queryString}` : ""}`;
}

export function messageListSentPath(queryString: string): string {
	return `${MESSAGES_V1}/sent${queryString ? `?${queryString}` : ""}`;
}

export function messageBatchPath(): string {
	return `${MESSAGES_V1}/batch`;
}

export function messageSendPath(): string {
	return `${MESSAGES_V1}/send`;
}

export function messageById(id: string): string {
	return `${MESSAGES_V1}/${id}`;
}

export function messageRawPath(id: string): string {
	return `${MESSAGES_V1}/${id}/raw`;
}

export function messageAttachmentPath(id: string, attachmentId: string): string {
	return `${MESSAGES_V1}/${id}/attachments/${attachmentId}`;
}

export function messageReadPath(id: string): string {
	return `${MESSAGES_V1}/${id}/read`;
}

export function messageStarPath(id: string): string {
	return `${MESSAGES_V1}/${id}/star`;
}

export function messagePendingCancelPath(id: string): string {
	return `${MESSAGES_V1}/pending/${id}/cancel`;
}

export function messageReplyPath(id: string): string {
	return `${MESSAGES_V1}/${id}/reply`;
}

export function messageReplyAllPath(id: string): string {
	return `${MESSAGES_V1}/${id}/reply-all`;
}

export function messageForwardPath(id: string): string {
	return `${MESSAGES_V1}/${id}/forward`;
}
