export const INBOX_V1 = "/api/inbox/v1";
export const MAILBOXES_V1 = `${INBOX_V1}/mailboxes`;

export function mailboxListPath(): string {
	return `${MAILBOXES_V1}/list`;
}

export function mailboxCreatePath(): string {
	return `${MAILBOXES_V1}/create`;
}

export function mailboxById(id: string): string {
	return `${MAILBOXES_V1}/${id}`;
}
