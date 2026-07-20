import { INBOX_V1 } from "@/services/inbox/mailbox/paths";

export const THREADS_V1 = `${INBOX_V1}/threads`;

export function threadListPath(queryString: string): string {
	return `${THREADS_V1}${queryString ? `?${queryString}` : ""}`;
}

export function threadBatchPath(): string {
	return `${THREADS_V1}/batch`;
}

export function threadById(id: string): string {
	return `${THREADS_V1}/${id}`;
}

export function threadAttachmentPath(id: string, attachmentId: string): string {
	return `${THREADS_V1}/${id}/attachments/${attachmentId}`;
}

export function threadReadPath(id: string): string {
	return `${THREADS_V1}/${id}/read`;
}

export function threadStarPath(id: string): string {
	return `${THREADS_V1}/${id}/star`;
}

export function threadArchivePath(id: string): string {
	return `${THREADS_V1}/${id}/archive`;
}

export function threadTrashPath(id: string): string {
	return `${THREADS_V1}/${id}/trash`;
}

export function threadRestorePath(id: string): string {
	return `${THREADS_V1}/${id}/restore`;
}
